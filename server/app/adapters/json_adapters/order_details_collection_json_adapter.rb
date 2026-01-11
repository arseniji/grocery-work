class OrderDetailsCollectionJsonAdapter < BaseJsonAdapter
  def initialize(collection:, order:, product_order_metadata: {}, pagination_meta: {}, metadata: {})
    @collection = collection
    @order = order
    @product_order_metadata = product_order_metadata
    @pagination_meta = pagination_meta
    @metadata = metadata
    super(collection)
  end

  def as_json(**options)
    {
      success: true,
      order: ShortOrderJsonAdapter.new(@order).as_json(**options),
      products: @collection.map do |product|
        product_json = ProductJsonAdapter.new(product).as_json(**options)
        order_meta = @product_order_metadata[product.id] || {}
        product_json[:metadata] = product_json[:metadata].merge(
          order_details: order_meta
        )
        
        product_json
      end,
      summary: @pagination_meta[:order_summary] || {},
      meta: @pagination_meta.except(:order_summary).merge(
        metadata: @metadata
      )
    }
  end
end