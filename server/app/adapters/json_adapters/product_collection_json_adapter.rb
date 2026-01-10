class ProductCollectionJsonAdapter < BaseJsonAdapter
  def initialize(collection: , pagination_meta: {}, metadata: {})
    @collection = collection
    @pagination_meta = pagination_meta
    @metadata = metadata
    super(collection)
  end

  def as_json(**options)
    {
      success: true,
      products: @collection.map{ |product| ProductJsonAdapter.new(product).as_json(**options) },
      meta: @pagination_meta
    }
  end
end