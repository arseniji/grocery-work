class CartProductJsonAdapter < BaseJsonAdapter
  def as_json(quantity: 1, **options)
      {
        success: true,
        id: @object.id,
        product_name: @object.product_name,
        price: @object.price,
        quantity: quantity,
        total_price: @object.price * quantity,
        category: @object.category,
        details: {
          unit: @object.measurement_unit,
          image_url: @object.img_path,
          stock_quantity: @object.quantity
        }
      }.merge(options.fetch(:metadata, {}))
  end
end