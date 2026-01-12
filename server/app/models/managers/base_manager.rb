class BaseManager
  class MethodOverridingError < StandardError; end
  private_class_method
  def self.paginate_with_filters(
    base_query,
    page_size:,
    number_page:,
    filters: {},
    search_fields: [],
    sorted_fields: {},
    default_order: { created_at: :desc }
  )

    query = apply_filters(base_query, filters)
    

    if filters[:search].present? && search_fields.any?
      query = apply_search(query, filters[:search], search_fields)
    end
    

    query = apply_sorting(query, sorted_fields, default_order)
    

    total_count = query.count
    

    paginated_results = query
      .offset((number_page.to_i - 1) * page_size.to_i)
      .limit(page_size)
    
    {
      results: paginated_results,
      total_count: total_count,
      query: query
    }
  end

  # Применение фильтров
  def self.apply_filters(query, filters)
    return query if filters.empty?
    
    filters.each do |field, value|
      next if value.blank?
      
      # Проверяем, существует ли поле в таблице
      if query.klass.column_names.include?(field.to_s)
        query = query.where(field => value)
      end
    end
    
    query
  end

  # Применение поиска
  def self.apply_search(query, search_term, search_fields)
    return query if search_term.blank? || search_fields.empty?
    
    search_term = "%#{search_term.strip}%"
    
    # Строим условие поиска
    conditions = search_fields.map do |field|
      if field.is_a?(Hash)
        # Специальный случай для кастомных условий
        field[:condition]
      else
        "#{field} ILIKE ?"
      end
    end
    
    # Создаем массив параметров
    values = conditions.map { |condition| condition.include?('?') ? search_term : nil }.compact
    
    query.where(conditions.join(' OR '), *values)
  end

  # Применение сортировки
  def self.apply_sorting(query, sorted_fields, default_order)
    if sorted_fields.present? && sorted_fields.is_a?(Hash)
      sorted_fields.each do |field, direction|
        if valid_sort_field?(query, field, direction)
          query = query.order("#{field} #{direction}")
        end
      end
      query
    else
      query.order(default_order)
    end
  end

  # Проверка валидности поля для сортировки
  def self.valid_sort_field?(query, field, direction)
    query.klass.column_names.include?(field.to_s) && 
    ['asc', 'desc'].include?(direction.to_s.downcase)
  end

  # Генерация метаданных для пагинации
  def self.generate_pagination_meta(total_count, page_size, number_page, filters = {})
    {
      current_page: number_page.to_i,
      page_size: page_size.to_i,
      total_pages: (total_count.to_f / page_size.to_i).ceil,
      total_count: total_count,
      filters: filters.compact
    }
  end

  def self.find_obj(obj_id, obj_type, obj_str_name: '')
      obj = obj_type.find_by(id: obj_id)
      return obj if obj
      self.error_response("Такого #{objobj_str_name} не существует", code: :not_found)
  end

  def self.extract_object(obj_result, observer_type)
    obj_result.each do |observer, result|
      if observer.is_a?(observer_type) || observer == observer_type
        return result
      end
    end
    return self.default_extract_obj
  end

  def self.default_extract_obj
    raise MethodOverridingError => e
  end

  def self.success_response
      JsonAdapterFacade.adapt(nil, type: :successful)
  end

  def self.error_response(message, details: {}, code: :not_found_order)
      error = ErrorObject.new(
        message: message, 
        code: code,
        details: details
      )
      JsonAdapterFacade.adapt(error, type: :error)
  end

  def self.error_response_validation(errors)
    error_details = errors.messages.map do |field, messages|
      {
        field: field,
        messages: messages,
        full_messages: errors.full_messages_for(field)
      }
    end
    
    error = ErrorObject.new(
      message: "Ошибка валидации данных",
      code: :validation_error,
      details: {
        errors: error_details,
        full_messages: errors.full_messages
      }
    )
    
    JsonAdapterFacade.adapt(error, type: :error)
  end

end