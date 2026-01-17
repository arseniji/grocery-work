require_relative '../commands/product_commands'

class AdminProductManager < BaseManager
  def self.update_product(product_id, product_data, use_command: true, user_id: nil)
    product = self.find_obj(product_id, Product, obj_str_name: "продукта")
    return product unless product.is_a?(Product)
    
    # Сохраняем предыдущее состояние для отмены
    previous_product_data = {
      product_name: product.product_name,
      price: product.price,
      rating: product.rating,
      category: product.category,
      description: product.description,
      measurement_unit: product.measurement_unit,
      quantity: product.quantity,
      img_path: product.img_path
    }
    
    begin
      if product.update(product_data)
        result = JsonAdapterFacade.adapt(product, type: :product)
        
        # Создаем команду для отмены, если включено
        if use_command && user_id
          command = UpdateProductCommand.new(
            user_id: user_id,
            product_id: product_id,
            product_data: product_data,
            previous_product_data: previous_product_data
          )
          CommandManager.execute_command(command, user_id)
        end
        
        result
      else
        self.error_response_validation(product.errors)
      end
    rescue => e
      self.error_response("Произошла ошибка при обновлении: #{e.message}", 
                         details: {product_id: product.id}, 
                         code: :update_error)
    end
  end

  def self.delete_product(product_id, use_command: true, user_id: nil)
    product = self.find_obj(product_id, Product, obj_str_name: "продукта")
    return product unless product.is_a?(Product)
    
    # Сохраняем данные продукта для отмены
    product_data = {
      product_name: product.product_name,
      price: product.price,
      rating: product.rating,
      category: product.category,
      description: product.description,
      measurement_unit: product.measurement_unit,
      quantity: product.quantity,
      img_path: product.img_path
    }
    
    product.destroy
    result = self.success_response
    
    # Создаем команду для отмены, если включено
    if use_command && user_id
      command = DeleteProductCommand.new(
        user_id: user_id,
        product_id: product_id,
        product_data: product_data
      )
      CommandManager.add_command_to_history(command, user_id, result)
    end
    
    result
  end

  def self.add_product(product_data, use_command: true, user_id: nil)
    product = Product.new(**product_data) 
    if product.save
      result = JsonAdapterFacade.adapt(product, 
                        type: :product,
                        metadata: {
                          created_at: product.created_at,
                          updated_at: product.updated_at
                        })
      
      # Создаем команду для отмены, если включено
      if use_command && user_id
        command = AddProductCommand.new(
          user_id: user_id,
          product_data: product_data,
          product_id: product.id
        )
        CommandManager.add_command_to_history(command, user_id, result)
      end
      
      result
    else
      self.error_response_validation(product.errors)
    end
  end
end