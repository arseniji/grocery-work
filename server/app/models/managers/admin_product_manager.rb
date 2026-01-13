class AdminProductManager < BaseManager
  def self.update_product(product_id, product_data, image_file = nil)
    product = self.find_obj(product_id, Product, obj_str_name: "продукта")
    return product unless product.is_a?(Product)
    
    begin
      if image_file.present?
        image_path = self.save_product_image(image_file, product.id)
        product_data[:img_path] = image_path if image_path
      end
      
      if product.update(product_data)
        JsonAdapterFacade.adapt(product, 
                                type: :product,
                                metadata: {
                                  created_at: product.created_at,
                                  updated_at: product.updated_at
                                })
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
    self.delete_product_image(product.img_path) if product.img_path.present?
    product.destroy
    self.success_response
  end

  def self.add_product(product_data, image_file = nil)
    product = Product.new(product_data)
    if image_file.present?
      image_path = self.save_product_image(image_file)
      product.img_path = image_path if image_path
    end
    
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

  def self.add_products_batch(products_data_with_images)
    successful = []
    failed = []
    
    products_data_with_images.each do |item|
      product_data = item[:product_data]
      image_file = item[:image_file]
      
      product = Product.new(product_data)
      
      if image_file.present?
        image_path = self.save_product_image(image_file)
        product.img_path = image_path if image_path
      end
      
      if product.save
        successful << product
      else
        failed << {
          product_data: product_data,
          errors: product.errors.full_messages
        }
      end
    end
    {
      success: true,
      created_count: successful.count,
      failed_count: failed.count,
      successful_products: successful.map { |p| JsonAdapterFacade.adapt(p, type: :product) },
      failed_items: failed
    }
  end
  
  private_class_method

  def self.save_product_image(image_file, product_id = nil)
    begin
      self.validate_image_file(image_file)

      filename = self.generate_image_filename(image_file, product_id)
      directory = Rails.root.join('public', 'images', 'products')
      FileUtils.mkdir_p(directory)
      filepath = File.join(directory, filename)
      File.open(filepath, 'wb') do |file|
        file.write(image_file.read)
      end
      create_thumbnail(filepath) if respond_to?(:create_thumbnail)
      "/images/products/#{filename}"
    rescue => e
      Rails.logger.error "Ошибка при сохранении изображения: #{e.message}"
      nil
    end
  end
  
  def self.delete_product_image(img_path)
    return unless img_path.present?
    
    begin
      full_path = Rails.root.join('public', img_path.sub(/^\//, ''))
      File.delete(full_path) if File.exist?(full_path)
      if img_path.include?('/products/')
        thumb_path = full_path.to_s.sub('/products/', '/products/thumbnails/')
        File.delete(thumb_path) if File.exist?(thumb_path)
      end
      
    rescue => e
      Rails.logger.error "Ошибка при удалении изображения: #{e.message}"
    end
  end

  def self.generate_image_filename(image_file, product_id = nil)
    ext = File.extname(image_file.original_filename).downcase
    timestamp = Time.current.to_i
    random = SecureRandom.hex(6)
    
    if product_id
      "product_#{product_id}_#{timestamp}_#{random}#{ext}"
    else
      "#{timestamp}_#{random}#{ext}"
    end
  end
  

  def self.validate_image_file(image_file)
    max_size = 5.megabytes
    if image_file.size > max_size
      raise "Файл слишком большой. Максимальный размер: #{max_size / 1.megabyte}MB"
    end
    
    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    unless allowed_types.include?(image_file.content_type)
      raise "Недопустимый тип файла. Разрешены: #{allowed_types.join(', ')}"
    end
    
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    ext = File.extname(image_file.original_filename).downcase
    unless allowed_extensions.include?(ext)
      raise "Недопустимое расширение файла. Разрешены: #{allowed_extensions.join(', ')}"
    end
  end
end