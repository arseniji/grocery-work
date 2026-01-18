class Api::V1::OrderController < Api::V1::BaseController
  
  def get_user_orders
    search_hash = params[:search].to_s.split(',').map { |pair| pair.split(':', 2) }.to_h.transform_values(&:strip) rescue {}
    sorted_fields_parsed = params[:sort].to_s.split(',').map { |pair| pair.split(':', 2) }.to_h.transform_values(&:strip) rescue {}


    status = params[:status]     
    page = params[:page]             
    search = search_hash      
    page_size = params[:page_size] 
    sorted_fields = sorted_fields_parsed
    # if sort.present?
    #   sort.split(',').each do |sort_param|
    #     field, direction = sort_param.split(':')
    #     sorted_fields[field] = direction if field && direction
    #   end
    # end
    result = OrderManager.get_user_orders(
      @current_user.id,
      number_page: page || 1,
      page_size: page_size || 20,
      search: search,
      status: status,
      sorted_fields: sorted_fields,
      search_fields: ['description']
      )
    render json: result
  end

  def get_order_detail_user
    order_id = params[:order_id]
    result = OrderManager.get_order_detail_user(@current_user.id, order_id)
    render json: result
  end

  def get_all_status_orders
    result = OrderManager.get_all_status_orders()
    render json: result
  end

  def create_order
    description = params[:description]
    result = OrderManager.create_order(@current_session_id, @current_user.id, description: description)
    render json: result
  end

  def cancellation_orders
    order_id = params[:order_id]
    result = OrderManager.cancellation_orders(order_id, @current_user.id)
    render json: result
  end

end