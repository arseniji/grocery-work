class OrderManager < BaseManager
  extend CustomObservable

  add_observer(CartManager)
  
  def self.get_user_orders(user_id, number_page:, page_size:, search: '', status: '', sorted_fields: {})
    orders = Order.where(user_id: user_id)
    result = paginate_with_filters(
      orders,
      page_size: page_size,
      number_page: number_page,
      filters: { status: status }.compact,
      search_fields: [{ condition: 'CAST(id AS TEXT) ILIKE ?' }, 'description'],
      sorted_fields: sorted_fields,
      default_order: { created_at: :desc }
    )
    pagination_meta = generate_pagination_meta(
      result[:total_count],
      page_size,
      number_page,
      {
        status: status.presence,
        search: search.presence,
        sorted_fields: sorted_fields.presence
      }.compact
    )
    JsonAdapterFacade.adapt_collection(
      result[:results],
      type: :orders,
      pagination_meta: pagination_meta,
      metadata: {
        filters: pagination_meta[:filters]
      }
    )
  end

  def self.get_order_detail_user(user_id, order_id)
    order = Order.includes(order_items: :product)
                 .find_by(user_id: user_id, id: order_id)

    if order.nil?
      return self.error_response("Заказ не найден", details: {order_id: order_id, user_id: user_id}, code: :order_not_found)
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
    cart, _, _, _ = self.extract_object(cart_session, CartManager)
    if cart.empty? || cart.product_collection.empty?
      return self.error_response("Корзина пуста", code: :empty_cart_error)
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
          return self.error_response("Продукт с ID #{product_id} не найден", details: {user_id: user_id, product_id: product_id}, code: :product_not_found)
        end
        
        if product.quantity < quantity
          order.destroy
          return self.error_response(
            "Недостаточно товара '#{product.product_name}' на складе. Доступно: #{product.quantity}, запрошено: #{quantity}",
            details: {product_id: product_id, user_id: user_id}, code: :not_enough_quantity
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
      
      self.success_response
      
    rescue ActiveRecord::RecordInvalid => e
      self.error_response("Не удалось создать заказ: #{e.message}", details: {user_id: user_id}, code: :error_create_order)
    rescue => e
      self.error_response("Ошибка при создании заказа: #{e.message}", details: {user_id: user_id}, code: :error_create_order)
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
      return self.error_response("Заказ не найден", 
                                details: {order_id: order_id, user_id: user_id}, 
                                code: :order_not_found)
    end

    case order.status
    when "delivered"
      return self.error_response("Полученный заказ невозможно отменить", 
                                details: {order_id: order_id, user_id: user_id}, 
                                code: :status_order_error)
    when "cancelled"
      return self.error_response("Заказ уже отменен", 
                                details: {order_id: order_id, user_id: user_id}, 
                                code: :status_order_error)
    end
      Order.transaction do
        order.order_items.each do |order_item|
          product = order_item.product
          if product
            product.update!(quantity: product.quantity + order_item.quantity)
          end
        end
        order.update!(status: "cancelled")
      end
      self.success_response()
  end

  
  private_class_method
 
  def self.default_extract_obj
    Cart.new()
  end

end