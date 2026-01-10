class SuccessfulJsonAdapter < BaseJsonAdapter
  def as_json(**options)
      {
        success: true,
        timestamp: Time.current.iso8601
      }.compact
  end
end