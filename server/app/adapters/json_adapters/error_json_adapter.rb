class ErrorJsonAdapter < BaseJsonAdapter
  def as_json(options = {})
    {
      success: false,
      error: {
        message: @object.message,
        code: @object.code,
        details: @object.details,
        timestamp: Time.current.iso8601
      }
    }
  end
end