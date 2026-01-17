class Api::V1::AdminOrderController < Api::V1::AdminBaseController
  def get_all_orders_user
    search_hash = params[:search].to_s.split(',').map { |pair| pair.split(':', 2) }.to_h.transform_values(&:strip) rescue {}
    sorted_fields_parsed = params[:sort].to_s.split(',').map { |pair| pair.split(':', 2) }.to_h.transform_values(&:strip) rescue {}

    status = params[:status]     
    page = params[:page]             
    search = search_hash     
    page_size = params[:page_size] 
    sorted_fields = sorted_fields_parsed
    
    result = AdminOrderManager.get_all_orders(
      number_page: page || 1,
      page_size: page_size || 20,
      search: search,
      status: status,
      sorted_fields: sorted_fields,
      search_fields: ['id', 'user_id', 'description', 'users.login', 'users.firstname', 'users.lastname']
    )
    render json: result    
  end

  def get_order_detail_user
    order_id = params[:order_id]
    user_id = params[:user_id]
    result = OrderManager.get_order_detail_user(user_id, order_id)
    render json: result
  end

  def update_orders
    order_data = buld_order_data(params)
    order_id = params[:order_id]
    user_id = params[:user_id]
    result = AdminOrderManager.update_orders(order_data, user_id, order_id, @current_user.id)
    render json: result
  end

  def add_product_orders_items
    order_id = params[:order_id]
    product_id = params[:product_id]
    user_id = params[:user_id]
    quantity = params[:quantity] || 1
    result = AdminOrderManager.add_product_orders_items(product_id, order_id, user_id, @current_user.id, quantity: quantity)
    render json: result
  end

  def delete_product_order_items
    order_id = params[:order_id]
    product_id = params[:product_id]
    user_id = params[:user_id]
    quantity = params[:quantity] || 1
    result = AdminOrderManager.delete_product_order_items(product_id, order_id, user_id, @current_user.id, quantity_to_remove: quantity)
    render json: result
  end

  def buld_order_data(params)
    {
      status: params[:status],
      description: params[:description]
    }
  end
end