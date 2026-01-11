class StatusCollectionJsonAdapter < BaseJsonAdapter
  def initialize(collection: , total_count: )
    @collection = collection
    @total_count = total_count
    super(collection)
  end

  def as_json(**options)
    status_items = @collection.map do |category|
      StatusJsonAdapter.new(category).as_json(**options)
    end
    
    {
      success: true,
      items: status_items,
      total_items: @total_count
    }
  end
end