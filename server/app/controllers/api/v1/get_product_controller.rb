class Api::V1::GetProductController < ApplicationController
  
  def get_product_details
    result = ProductManager.get_product_details(product_id: params[:id])
    render json: result
  end

  def get_product_page
    category = params[:category]     
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
    
    result = ProductManager.get_product_page(
      page_size: page_size || 20,
      number_page: page || 1,
      category: category,
      search: search,
      sorted_fields: sorted_fields
    )
    
    render json: result
  end

  def get_top_products
    result = ProductManager.get_top_products(size_top: params[:size_top])
    render json: result
  end

end