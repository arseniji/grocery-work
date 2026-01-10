class Api::V1::OrderController < Api::V1::BaseController
  
  def get_user_orders
    status = params[:status]     
    page = params[:page]             
    search = params[:search]          
    sort = params[:sort]     
    page_size = params[:page_size] 
    sorted_fields = {}
    if sort.present?
      sort.split(',').each do |sort_param|
        field, direction = sort_param.split(':')
        sorted_fields[field] = direction if field && direction
      end
    end
    result = OrderManager.get_user_orders(
      @current_user.id,
      number_page: page || 1,
      page_size: page_size || 20,
      search: search,
      status: status,
      sorted_fields: sorted_fields)
    render json: result
  end

end