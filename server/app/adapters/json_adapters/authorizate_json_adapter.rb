class AuthorizateJsonAdapter < BaseJsonAdapter
  def as_json(**options)
    {
      success: true,
      user:
      {
        id: @object.id,
        login: @object.login,
        role: @object.role,
      },
      session: SessionJsonAdapter.new(options[:session]).as_json(**options)
    }
  end
end