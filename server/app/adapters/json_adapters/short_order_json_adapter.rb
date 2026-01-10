class ShortOrderJsonAdapter < BaseJsonAdapter
    def as_json(**options)
      {
        success: true,
        id: @object.id,
        status: @object.status,
        description: @object.description,
        timestamps: {
            created_at: @object.created_at,
            updated_at: @object.updated_at
        },
        metadata: options[:metadata] || {}
      }.compact
    end
end