class Api::V1::AdminProductController < Api::V1::AdminBaseController
  
  def get_products
    result = ProductManager.get_product_page(
      page_size: params[:page_size] || 50,
      number_page: params[:page] || 1,
      category: params[:category],
      search: params[:search],
      sorted_fields: params[:sorted_fields] || {}
    )
    
    render json: result
  end

  def get_product_details
    result = ProductManager.get_product_details(product_id: params[:id])
    render json: result
  end
  

  def update_product
    product_data = build_product_data(params)
    image_file = params[:image]
    result = AdminProductManager.update_product(
      params[:id], 
      product_data, 
      image_file
    )
    render json: result
  end
  

  def delete_product
    result = AdminProductManager.delete_product(params[:id])
    render json: result
  end

  def add_product
    product_data = build_product_data(params) 
    image_file = params[:image]  
    result = AdminProductManager.add_product(product_data, image_file)
    render json: result
  end
  
  def add_products_batch
    render json: { error: "Метод в разработке" }, status: :not_implemented
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
      # img_path устанавливается при сохранении изображения
    }.compact
  end
  
  def product_params
    params.require(:product).permit(
      :product_name, :price, :rating, :category, 
      :description, :measurement_unit, :quantity, :image
    )
  end
end