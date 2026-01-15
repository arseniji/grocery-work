class ProfileCollectionJsonAdapter < BaseJsonAdapter
  def initialize(collection: , pagination_meta: {}, metadata: {})
    @collection = collection
    @pagination_meta = pagination_meta
    @metadata = metadata
    super(collection)
  end

  def as_json(**options)
    {
      success: true,
      users: @collection.map{ |profile| ShortProfileJsonAdapter.new(profile).as_json(**options) },
      meta: @pagination_meta
    }
  end
end