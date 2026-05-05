class ProductManager < BaseManager
  
  def self.get_product_details(product_id: )
    product = Product.find_by(id: product_id)
    if product
      JsonAdapterFacade.adapt(
                                product, 
                                type: :product,
                                metadata: {
                                  includes: [:category]
                                },
                                some_other_option: 'value'
                              )
    else
      self.error_response("Такого продукта не существует", details: { product_id: product_id }, code: :not_found)
    end
  end

  def self.get_product_page(page_size:, number_page:, category: '', search: {}, sorted_fields: {}, search_fields: [])
    products = Product.where('quantity > 0').where('location IS NULL OR location = ?', 'in_store')
    result = paginate_with_filters(
      products,
      page_size: page_size,
      number_page: number_page,
      filters: { category: category, search: search }.compact,
      search_fields: search_fields,
      sorted_fields: sorted_fields,
      default_order: { created_at: :desc }
    )
    pagination_meta = generate_pagination_meta(
      result[:total_count],
      page_size,
      number_page,
      {
        category: category.presence,
        search: search.presence,
        sorted_fields: sorted_fields.presence
      }.compact
    )
    JsonAdapterFacade.adapt_collection(
      result[:results],
      type: :product_collection,
      pagination_meta: pagination_meta,
      metadata: {
        filters: pagination_meta[:filters]
      }
    )
  end

  def self.get_top_products(size_top: 10)
      products = Product
        .where('rating >= 4.0 AND quantity > 0')
        .order(rating: :desc)
        .limit(size_top)
      
      JsonAdapterFacade.adapt_collection(
        products,
        type: :product_collection,
        pagination_meta: {
          is_top_list: true,
          size: size_top
        }
      )
  end

  def self.get_all_category()
    category_names = Product.distinct.pluck(:category).compact.sort
    categories = category_names.map do |category_name|
      Category.new(category_name)
    end
    total_count = categories.count
    JsonAdapterFacade.adapt_collection(categories, type: :categories, total_count: total_count)
  end
end