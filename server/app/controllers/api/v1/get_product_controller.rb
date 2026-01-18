class Api::V1::GetProductController < ApplicationController
  
  def get_product_details
    result = ProductManager.get_product_details(product_id: params[:id])
    render json: result
  end

  def get_product_page
    search_hash = params[:search].to_s.split(',').map { |pair| pair.split(':', 2) }.to_h.transform_values(&:strip) rescue {}
    sorted_fields_parsed = params[:sort].to_s.split(',').map { |pair| pair.split(':', 2) }.to_h.transform_values(&:strip) rescue {}

    category = params[:category]     
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
    
    result = ProductManager.get_product_page(
      page_size: page_size || 20,
      number_page: page || 1,
      category: category,
      search: search,
      sorted_fields: sorted_fields,
      search_fields: ['product_name', 'description', 'rating', 'price']
    )
    
    render json: result
  end

  def get_top_products
    result = ProductManager.get_top_products(size_top: params[:size_top])
    render json: result
  end

  def get_all_category
    result = ProductManager.get_all_category
    render json: result
  end

end