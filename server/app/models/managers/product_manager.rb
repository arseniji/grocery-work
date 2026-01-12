
class ProductManager
  
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
      error = ErrorObject.new(message: "Такого продукта не существует", 
                                     code: :not_found,
                                     details: { product_id: product_id })
      JsonAdapterFacade.adapt(error, type: :error)
    end
  end

  def self.get_product_page(page_size: , number_page: , category: '', search: '', sorted_fields: {})
    products = Product.all

    if category.present?
      products = products.where(category: category)
    end
    
    if search.present?
      search_term = "%#{search.strip}%"
      products = products.where(
        "product_name ILIKE ? OR description ILIKE ?", 
        search_term, search_term
      )
    end
    
    if sorted_fields.present? && sorted_fields.is_a?(Hash)
      sorted_fields.each do |field, direction|
        if Product.column_names.include?(field.to_s) && ['asc', 'desc'].include?(direction.to_s.downcase)
          products = products.order("#{field} #{direction}")
        end
      end
    else
      products = products.order(created_at: :desc)
    end

    total_count = products.count

    paginated_products = products
        .offset((number_page.to_i - 1) * page_size.to_i)
        .limit(page_size)
    
    JsonAdapterFacade.adapt_collection(
                                      paginated_products,
                                      type: :product_collection,
                                      pagination_meta: {
                                        current_page: number_page,
                                        page_size: page_size,
                                        total_pages: (total_count.to_f / page_size.to_i).ceil,
                                        total_count: total_count,
                                      },
                                      metadata: {
                                        filters: {
                                          category: category.presence,
                                          search: search.presence,
                                          sorted_fields: sorted_fields.presence
                                        }.compact
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