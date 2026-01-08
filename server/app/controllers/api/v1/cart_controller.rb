class Api::V1::CartController < Api::V1::BaseController
  
  def add_product_to_cart
    product_id = params[:product_id]
    quantity = params[:quantity]
    result = CartManager.add_product_to_cart(product_id, quantity, @current_session_id)
    render json: result
  end

  def add_quantity_product_on_cart
    product_id = params[:product_id]
    result = CartManager.add_quantity_product_on_cart(product_id, @current_session_id)
    render json: result
  end

  def delete_product_on_cart
    product_id = params[:product_id]
    result = CartManager.delete_product_on_cart(product_id, @current_session_id)
    render json: result
  end

  def delete_quantity_product_on_cart
    product_id = params[:product_id]
    result = CartManager.delete_quantity_product_on_cart(product_id, @current_session_id)
    render json: result
  end

  def clear_products_to_cart
    result = CartManager.clear_products_to_cart(@current_session_id)
    render json: result
  end

  def get_cart
    result = CartManager.get_cart(@current_session_id)
    render json: result
  end
end