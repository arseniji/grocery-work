class SessionJsonAdapter < BaseJsonAdapter
  def as_json(**options)
    {
      session_id: @object.id,
      expires_at: @object.expires_at
    }
  end
end