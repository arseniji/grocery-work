class ProductCollectionJsonAdapter < BaseJsonAdapter
  def initialize(collection: , pagination_meta: {})
    @collection = collection
    @pagination_meta = pagination_meta
    super(collection)
  end

  def as_json(**options)
    {
      success: true,
      products: @collection.map{ |product| ProductJsonAdapter.new(product).as_json(options) },
      meta: @pagination_meta
    }
  end
end