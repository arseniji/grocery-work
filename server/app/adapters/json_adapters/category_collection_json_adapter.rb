class CategoryCollectionJsonAdapter < BaseJsonAdapter
  def initialize(collection: , total_count: )
    @collection = collection
    @total_count = total_count
    super(collection)
  end

  def as_json(**options)
    cartegory_items = @collection.map do |category|
      CategoryJsonAdapter.new(category).as_json(**options)
    end
    
    {
      success: true,
      items: cartegory_items,
      total_items: @total_count
    }
  end
end