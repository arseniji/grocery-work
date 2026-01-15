class AdminProductManager < BaseManager
  def self.update_product(product_id, product_data)
    product = self.find_obj(product_id, Product, obj_str_name: "продукта")
    return product unless product.is_a?(Product)
    
    begin
      if product.update(product_data)
        JsonAdapterFacade.adapt(product, 
                                type: :product
                                )
      else
        self.error_response_validation(product.errors)
      end
    rescue => e
      self.error_response("Произошла ошибка при обновлении: #{e.message}", 
                         details: {product_id: product.id}, 
                         code: :update_error)
    end
  end

  def self.delete_product(product_id)
    product = self.find_obj(product_id, Product, obj_str_name: "продукта")
    return product unless product.is_a?(Product)
    product.destroy
    self.success_response
  end

  def self.add_product(product_data)
    product = Product.new(**product_data) 
    if product.save
      JsonAdapterFacade.adapt(product, 
                        type: :product,
                        metadata: {
                          created_at: product.created_at,
                          updated_at: product.updated_at
                        })
    else
      self.error_response_validation(product.errors)
    end
  end
end