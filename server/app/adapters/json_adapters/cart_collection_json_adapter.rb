class CartCollectionJsonAdapter < BaseJsonAdapter
  def initialize(collection:, total_price:, total_items:, quantities: {})
    @collection = collection
    @quantities = quantities
    @total_price = total_price
    @total_items = total_items
    super(collection)
  end
  
  def as_json(**options)
    cart_items = @collection.map do |product|
      quantity = @quantities[product.id.to_s] || @quantities[product.id] || 1
      CartProductJsonAdapter.new(product).as_json(quantity: quantity, **options)
    end
    
    {
      success: true,
      items: cart_items,
      summary: {
        total_items: @total_items,
        total_price: @total_price,
        unique_products: @quantities.size
      }
    }
  end
end