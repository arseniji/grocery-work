class OrderManager
  extend CustomObservable

  add_observer(CartManager)
  
  def self.get_user_orders(user_id, number_page: , page_size: , search: '', status: '', sorted_fields: {})
    orders = Order.where(user_id: user_id)
    if status.presence
      orders = orders.where(status: status)
    end

    if search.present?
      search_term = "%#{search.strip}%"
      orders = orders.where(
        "CAST(id AS TEXT) ILIKE ? OR description ILIKE ?", 
        search_term, search_term
      )
    end
    
    if sorted_fields.present? && sorted_fields.is_a?(Hash)
      sorted_fields.each do |field, direction|
        if Order.column_names.include?(field.to_s) && ['asc', 'desc'].include?(direction.to_s.downcase)
          orders = orders.order("#{field} #{direction}")
        end
      end
    else
        orders = orders.order(created_at: :desc)
    end

    total_count = orders.count
    paginated_order = orders
        .offset((number_page.to_i - 1) * page_size.to_i)
        .limit(page_size)
    JsonAdapterFacade.adapt_collection(paginated_order, 
                                                type: :orders,
                                                pagination_meta: {
                                                  current_page: number_page,
                                                  page_size: page_size,
                                                  total_pages: (total_count.to_f / page_size.to_i).ceil,
                                                  total_count: total_count,
                                                },
                                                metadata: {
                                                  filters: {
                                                    status: status.presence,
                                                    search: search.presence,
                                                    sorted_fields: sorted_fields.presence
                                                  }.compact
                                                }
                                              )
  end

  def self.get_order_detail_user(user_id, order_id)
    order = Order.includes(order_items: :product)
                 .find_by(user_id: user_id, id: order_id)

    if order.nil?
      return error_response("Заказ не найден", order_id, user_id)
    end

    order_items_info = order.order_items.map do |item|
      {
        product: item.product,
        order_item: item,
        quantity: item.quantity,
        total_price: item.price_at_order
      }
    end

    products = order_items_info.map { |info| info[:product] }

    product_order_metadata = {}
    order_items_info.each do |info|
      product_order_metadata[info[:product].id] = {
        quantity_in_order: info[:quantity],
        total_price_for_item: info[:total_price],
        ordered_at: info[:order_item].created_at
      }
    end
    
    JsonAdapterFacade.adapt_collection(
      products,
      type: :order_details,
      order: order,
      product_order_metadata: product_order_metadata,
      pagination_meta: {
        order_summary: {
          total_items: order_items_info.sum { |info| info[:quantity] },
          total_price: order_items_info.sum { |info| info[:total_price] },
          items_count: order_items_info.size
        }
      },
      metadata: {
        order_source: 'order_detail',
      }
    )
  end

  def self.create_order(session_id, user_id, description: '')
    cart_session = notify_observers(:get_cart_info, session_id)
    cart, _, _, _ = self.extract_cart(cart_session)
    
    if cart.empty? || cart.product_collection.empty?
      return error_response("Корзина пуста", nil, user_id, code: :empty_cart_error)
    end
    
    order_data = {
      user_id: user_id,
      status: 'processing',
      description: description,
    }
    
    begin
      order = Order.create!(order_data)
      order_id = order.id
      
      product_ids = cart.product_collection.keys.map { |key| key.to_s.to_i }
      products = Product.where(id: product_ids).index_by(&:id)
      
      order_items_data = []
      
      cart.product_collection.each do |product_key, quantity|
        product_id = product_key.to_s.to_i
        product = products[product_id]
        
        if product.nil?
          order.destroy
          return error_response("Продукт с ID #{product_id} не найден", nil, user_id)
        end
        
        if product.quantity < quantity
          order.destroy
          return error_response(
            "Недостаточно товара '#{product.product_name}' на складе. Доступно: #{product.quantity}, запрошено: #{quantity}",
            nil, user_id
          )
        end
        
        price_at_order = product.price * quantity
        
        order_item_data = {
          order_id: order_id,
          product_id: product_id,
          quantity: quantity,
          price_at_order: price_at_order,
        }
        
        order_items_data << order_item_data
        
        product.update!(quantity: product.quantity - quantity)
      end
      
      OrderItem.insert_all(order_items_data) if order_items_data.any?
      
      notify_observers(:clear_products_to_cart, session_id)
      
      JsonAdapterFacade.adapt(nil, type: :successful)
      
    rescue ActiveRecord::RecordInvalid => e
      error_response("Не удалось создать заказ: #{e.message}", nil, user_id)
    rescue => e
      error_response("Ошибка при создании заказа: #{e.message}", nil, user_id)
    end
  end

  def self.get_all_status_orders()
    status_names = Order.statuses.keys
    status_collection = status_names.map do |status_name|
      Status.new(status_name)
    end
    total_count = status_collection.count
    JsonAdapterFacade.adapt_collection(status_collection, type: :status_collection, total_count: total_count)
  end

  def self.cancellation_orders(order_id, user_id)
    order = Order.includes(order_items: :product)
                 .find_by(user_id: user_id, id: order_id)

    if order.nil?
      return error_response("Заказ не найден", order_id, user_id)
    end
    case order.status
      when "avalible"
        return error_response("Полученый заказ невозможно отменить", order_id, user_id, code: :status_order_error)
      when "cancelled"
        return error_response("Заказ уже отменен", order_id, user_id, code: :status_order_error)
    end
    order.update(status: "cancelled")      
    JsonAdapterFacade.adapt(nil, type: :successful)
  end

  
  private_class_method
  def self.error_response(message, order_id, user_id, code: :not_found_order)
      error = ErrorObject.new(
        message: message, 
        code: code,
        details: { order_id: order_id,
                   user_id: user_id }
      )
      JsonAdapterFacade.adapt(error, type: :error)
  end

  def self.extract_cart(cart_result)
    cart_result.each do |observer, result|
      if observer.is_a?(CartManager) || observer == CartManager
        cart = result
        return cart
      end
    end
    return {}
  end

end