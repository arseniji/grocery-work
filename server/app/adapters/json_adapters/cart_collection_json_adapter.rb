class CartCollectionJsonAdapter
  def initialize(collection:, quantities: {})
    @collection = collection
    @quantities = quantities
    super(collection)
  end
  
  def as_json(**options)
    total_price = options[:total_price] 
    total_items = options[:total_items] 
    cart_items = @collection.map do |product|
      quantity = @quantities[product.id.to_s] || @quantities[product.id] || 1
      CartProductJsonAdapter.new(product).as_json(quantity: quantity, **options)
    end
    
    {
      success: true,
      items: cart_items,
      summary: {
        total_items: total_items,
        total_price: total_price,
        unique_products: @quantities.size
      }
    }
  end
end