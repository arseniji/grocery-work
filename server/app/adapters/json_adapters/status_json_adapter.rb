class StatusJsonAdapter < BaseJsonAdapter
  def as_json(**options)
    {
      success: true,
      status_name: @object.status_name 
    }
  end
end