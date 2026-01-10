class OrderManager
  
  def self.get_user_orders(user_id, number_page: , page_size: , search: '', status: '', sorted_fields: {})
    orders = Order.where(user_id: user_id)
    if status.presence
      orders = orders.where(status: status)
    end

    if search.present?
      search_term = "%#{search.strip}%"
      orders = orders.where(
        "CAST(id AS TEXT) ILIKE ? OR description ILIKE ?", 
        search_term, search_term
      )
    end
    
    if sorted_fields.present? && sorted_fields.is_a?(Hash)
      sorted_fields.each do |field, direction|
        if Order.column_names.include?(field.to_s) && ['asc', 'desc'].include?(direction.to_s.downcase)
          orders = orders.order("#{field} #{direction}")
        end
      end
    else
        orders = orders.order(created_at: :desc)
    end

    total_count = orders.count
    paginated_order = orders
        .offset((number_page.to_i - 1) * page_size.to_i)
        .limit(page_size)
    JsonAdapterFacade.adapt_collection(paginated_order, 
                                                type: :orders,
                                                pagination_meta: {
                                                  current_page: number_page,
                                                  page_size: page_size,
                                                  total_pages: (total_count.to_f / page_size.to_i).ceil,
                                                  total_count: total_count,
                                                },
                                                metadata: {
                                                  filters: {
                                                    status: status.presence,
                                                    search: search.presence,
                                                    sorted_fields: sorted_fields.presence
                                                  }.compact
                                                }
                                              )
  end
end