class Cart
  class SizeCartError < StandardError; end

  attr_reader :product_collection

  def initialize(product_collection: {})
    @product_collection = product_collection
  end

  def add_product(product, quantity: 1)
    validate_stock(product, quantity)
    @product_collection[product.id] = quantity
  end

  def delete_product(product)
    @product_collection.delete(product.id)
  end

  def delete_quantity_product(product)
    return unless @product_collection[product.id]
    
    @product_collection[product.id] -= 1
    
    if @product_collection[product.id] == 0
      delete_product(product)
    end
  end

  def add_quantity_product(product)
    current_quantity = @product_collection[product.id] || 0
    validate_stock(product, current_quantity + 1)
    @product_collection[product.id] = current_quantity + 1
  end

  def empty?
    @product_collection.empty?
  end

  def total_items
    @product_collection.values.sum
  end

  def has_product?(product_id)
    @product_collection.key?(product_id)
  end

  def product_quantity(product_id)
    @product_collection[product_id] || 0
  end

  private

  def validate_stock(product, requested_quantity)
    return unless product.quantity < requested_quantity
    
    raise SizeCartError, 
      "Недостаточно товара в магазине. Доступно: #{product.quantity}, запрошено: #{requested_quantity}"
  end
end