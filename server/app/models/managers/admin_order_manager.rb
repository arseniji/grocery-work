class AdminOrderManager < BaseManager
  extend CustomObservable
  add_observer(OrderManager)


  def self.update_orders(order_data, user_id, order_id, current_user_id)
    puts current_user_id, user_id
    order = find_order_with_validation(order_id, current_user_id)
    return order unless order.is_a?(Order)

    handle_status_change(order, order_data[:status]) if order_data[:status].present?

    if order.update(order_data)
      fetch_updated_order(order.user_id, order_id)
    else
      error_response_validation(order.errors)
    end
  end

  def self.add_product_orders_items(product_id, order_id, user_id, current_user_id, quantity: 1)
    order = find_order_with_validation(order_id, current_user_id, allowed_statuses: ['processing', 'pending'])
    return order unless order.is_a?(Order)

    product = find_product_with_validation(product_id, quantity)
    return product unless product.is_a?(Product)

    process_product_addition(order, product, quantity)
  end

  def self.delete_product_order_items(product_id, order_id, user_id, current_user_id, quantity_to_remove: nil)
    order = find_order_with_validation(order_id, current_user_id, allowed_statuses: ['processing', 'pending'])
    return order unless order.is_a?(Order)

    order_item = find_order_item_with_validation(order, product_id)
    return order_item unless order_item.is_a?(OrderItem)

    quantity_to_remove = validate_and_get_quantity_to_remove(order_item, quantity_to_remove)
    return quantity_to_remove unless quantity_to_remove.is_a?(Integer)

    process_product_removal(order, order_item, quantity_to_remove)
  end


  private_class_method

  def self.find_order_with_validation(order_id, current_user_id, allowed_statuses: nil)
    order = Order.includes(order_items: :product).find_by(id: order_id)
    
    return error_response("Заказ не найден", 
                         details: { order_id: order_id }, 
                         code: :order_not_found) if order.nil?
    if order.user_id == current_user_id
      return error_response("Невозможно менять заказ у самого себя", 
                           details: { order_id: order_id, 
                                     user_id: order.user_id }, 
                           code: :unauthorized)
    end

    if allowed_statuses && !allowed_statuses.include?(order.status)
      return error_response("Нельзя изменять заказ со статусом '#{order.status}'", 
                           details: { order_id: order_id, status: order.status }, 
                           code: :invalid_order_status)
    end

    order
  end

  def self.find_product_with_validation(product_id, required_quantity)
    product = find_obj(product_id, Product, obj_str_name: "продукта")
    return product unless product.is_a?(Product)

    if product.quantity < required_quantity
      return error_response("Недостаточно товара на складе", 
                           details: { 
                             product_id: product_id, 
                             product_name: product.product_name,
                             available: product.quantity, 
                             requested: required_quantity 
                           }, 
                           code: :insufficient_quantity)
    end

    product
  end

  def self.find_order_item_with_validation(order, product_id)
    order_item = order.order_items.find_by(product_id: product_id)
    
    return error_response("Товар не найден в заказе", 
                         details: { order_id: order.id, product_id: product_id }, 
                         code: :product_not_in_order) if order_item.nil?

    order_item
  end

  def self.validate_and_get_quantity_to_remove(order_item, quantity_to_remove)
    quantity_to_remove ||= order_item.quantity

    if quantity_to_remove <= 0
      return error_response("Количество для удаления должно быть больше 0", 
                           details: { quantity_to_remove: quantity_to_remove }, 
                           code: :invalid_quantity)
    elsif quantity_to_remove > order_item.quantity
      return error_response("Нельзя удалить больше товара, чем есть в заказе", 
                           details: { 
                             available_in_order: order_item.quantity,
                             requested_to_remove: quantity_to_remove 
                           }, 
                           code: :exceeds_quantity)
    end

    quantity_to_remove
  end

  def self.handle_status_change(order, new_status)
    if new_status == 'cancelled' && order.status != 'cancelled'
      return_products_to_stock(order)
    elsif order.status == 'cancelled' && new_status != 'cancelled'
      check_products_availability(order)
    end
  end

  def self.process_product_addition(order, product, quantity)
    existing_order_item = order.order_items.find_by(product_id: product.id)
    
    if existing_order_item
      existing_order_item.quantity += quantity
      existing_order_item.price_at_order = product.price * existing_order_item.quantity
      return error_response_validation(existing_order_item.errors) unless existing_order_item.save
    else
      order_item = OrderItem.new(
        order_id: order.id,
        product_id: product.id,
        quantity: quantity,
        price_at_order: product.price * quantity
      )
      return error_response_validation(order_item.errors) unless order_item.save
    end

    product.update!(quantity: product.quantity - quantity)
    
    fetch_updated_order(order.user_id, order.id)
  end

  def self.process_product_removal(order, order_item, quantity_to_remove)
    product = order_item.product
    
    if quantity_to_remove == order_item.quantity
      order_item.destroy!
      notify_observers(:cancellation_orders, order.user_id, order.id) if order.order_items.reload.empty?
    else
      order_item.quantity -= quantity_to_remove
      order_item.price_at_order = product.price * order_item.quantity
      return error_response_validation(order_item.errors) unless order_item.save
    end

    product.update!(quantity: product.quantity + quantity_to_remove)
    
    fetch_updated_order(order.user_id, order.id)
  end

  def self.fetch_updated_order(user_id, order_id)
    order_result = notify_observers(:get_order_detail_user, user_id, order_id)
    extract_object(order_result, OrderManager)
  end

  def self.return_products_to_stock(order)
    order.order_items.each do |order_item|
      product = order_item.product
      product&.update!(quantity: product.quantity + order_item.quantity)
    end
  end

  def self.check_products_availability(order)
    unavailable_products = []
    
    order.order_items.each do |order_item|
      product = order_item.product
      if product && product.quantity < order_item.quantity
        unavailable_products << {
          product_name: product.product_name,
          available: product.quantity,
          required: order_item.quantity
        }
      end
    end

    if unavailable_products.any?
      error_message = unavailable_products.map do |p|
        "Недостаточно товара '#{p[:product_name]}' на складе. Доступно: #{p[:available]}, требуется: #{p[:required]}"
      end.join("\n")
      
      raise error_message
    end
  end

  def self.default_extract_obj
    {}
  end
end