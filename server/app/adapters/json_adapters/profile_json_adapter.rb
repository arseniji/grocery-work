class ProfileJsonAdapter < BaseJsonAdapter
  def as_json(**options)
    {
      user_id: @object.id,
      login: @object.login,
      phone: @object.phone,
      firstname: @object.firstname,
      lastname: @object.lastname,
      patronymic: @object.patronymic,
      metadata: options[:metadata] || {}
  }.compact
  end
end