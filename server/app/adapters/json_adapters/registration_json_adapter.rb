class RegistrationJsonAdapter < BaseJsonAdapter
  def as_json(**options)
        {
      success: true,
      user: {
        id: @object.id,
        login: @object.login,
        firstname: @object.firstname,
        lastname: @object.lastname,
        phone: @object.phone,
        role: @object.role,
      },
      session: SessionJsonAdapter.new(options[:session]).as_json(**options)
    }
  end
end