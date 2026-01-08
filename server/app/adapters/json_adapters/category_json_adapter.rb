class CategoryJsonAdapter < BaseJsonAdapter
  def as_json(**options)
    {
      success: true,
      category_name: @object.category_name 
    }
  end
end