class Api::V1::AdminProductController < Api::V1::AdminBaseController
  
  def get_products
    search_hash = params[:search].to_s.split(',').map { |pair| pair.split(':', 2) }.to_h.transform_values(&:strip) rescue {}
    sorted_fields_parsed = params[:sort].to_s.split(',').map { |pair| pair.split(':', 2) }.to_h.transform_values(&:strip) rescue {}

    result = ProductManager.get_product_page(
      page_size: params[:page_size] || 50,
      number_page: params[:page] || 1,
      category: params[:category],
      search: search_hash,
      sorted_fields: sorted_fields_parsed,
      search_fields: ['id', 'product_name', 'description', 'rating', 'price', 'barcode']
    )
    
    render json: result
  end

  def get_product_details
    result = ProductManager.get_product_details(product_id: params[:id])
    render json: result
  end
  

  def update_product
    product_data = build_product_data(params)
    result = AdminProductManager.update_product(
      params[:id], 
      product_data,
      user_id: @current_user.id
    )
    render json: result
  end
  

  def delete_product
    result = AdminProductManager.delete_product(params[:id], user_id: @current_user.id)
    render json: result
  end

  def add_product
    product_data = build_product_data(params) 
    result = AdminProductManager.add_product(product_data, user_id: @current_user.id)
    render json: result
  end
    
  private
  
  def build_product_data(params)
    {
      product_name: params[:product_name] || params[:name],
      price: params[:price],
      rating: params[:rating],
      category: params[:category],
      description: params[:description],
      measurement_unit: params[:measurement_unit] || params[:unit] || 'шт',
      quantity: params[:quantity],
      img_path: params[:img_path].to_s,
      barcode: params[:barcode]
    }.compact
  end
end