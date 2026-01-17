class AdminShortOrderJsonAdapter < BaseJsonAdapter
  def as_json(**options)
    {
      success: true,
      id: @object.id,
      status: @object.status,
      description: @object.description,
      user: {
        user_id: @object.user.id,
        login: @object.user.login,
        firstname: @object.user.firstname,
        lastname: @object.user.lastname
      },
      timestamps: {
        created_at: @object.created_at,
        updated_at: @object.updated_at
      },
      metadata: options[:metadata] || {}
    }.compact
  end
end
