class ShortProfileJsonAdapter < BaseJsonAdapter
  def as_json(**options)
    {
      user_id: @object.id,
      login: @object.login,
      firstname: @object.firstname,
      lastname: @object.lastname,
      role: @object.role,
      metadata: options[:metadata] || {}
  }.compact
  end
end