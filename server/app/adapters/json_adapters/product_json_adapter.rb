class ProductJsonAdapter < BaseJsonAdapter
    def as_json(**options)
      {
        success: true,
        id: @object.id,
        product_name: @object.product_name,
        price: @object.price,
        rating: @object.rating,
        category: @object.category,
        details: {
            description: @object.description,
            unit: @object.measurement_unit,
            image_url: @object.img_path,
            quantity: @object.quantity,
            barcode: @object.barcode,
            location: @object.location
        },
        timestamps: {
            created_at: @object.created_at,
            updated_at: @object.updated_at
        },
        metadata: options[:metadata] || {}
      }.compact
    end

end 