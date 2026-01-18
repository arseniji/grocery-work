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
    default_order: { created_at: :desc },
    allowed_search_fields: nil,
    allowed_sort_fields: nil
  )

    query = apply_filters(base_query, filters)
    

    if filters[:search].present? && search_fields.any?
      query = apply_search(query, filters[:search], search_fields, allowed_search_fields)
    end
    

    query = apply_sorting(query, sorted_fields, default_order, allowed_sort_fields)
    

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
  def self.apply_search(query, search_hash, search_fields, allowed_search_fields = nil)
    return query if search_hash.blank? || search_fields.empty?
    
    search_hash.each do |field, value|
      next if value.blank?
      
      field_str = field.to_s
      if search_fields.include?(field_str)
        # Если указаны разрешенные поля, проверяем их
        if allowed_search_fields
          if allowed_search_fields.include?(field_str)
            # Если поле содержит точку (например, "users.login"), используем его как есть
            if field_str.include?('.')
              query = query.where("#{field_str}::text ILIKE ?", "%#{value}%")
            else
              query = query.where("#{query.klass.table_name}.#{field_str}::text ILIKE ?", "%#{value}%")
            end
          end
        # Иначе проверяем только поля основной таблицы (старая логика)
        elsif query.klass.column_names.include?(field_str)
          query = query.where("#{field_str}::text ILIKE ?", "%#{value}%")
        end
      end
    end
    
    query
  end

  # Применение сортировки
  def self.apply_sorting(query, sorted_fields, default_order, allowed_sort_fields = nil)
    if sorted_fields.present? && sorted_fields.is_a?(Hash)
      sorted_fields.each do |field, direction|
        if valid_sort_field?(query, field, direction, allowed_sort_fields)
          field_str = field.to_s
          # Если поле содержит точку (например, "users.login"), используем его как есть
          if field_str.include?('.')
            query = query.order("#{field_str} #{direction}")
          elsif allowed_sort_fields
            # Если указаны разрешенные поля, добавляем префикс таблицы для явности
            query = query.order("#{query.klass.table_name}.#{field_str} #{direction}")
          else
            # Старая логика для обратной совместимости
            query = query.order("#{field_str} #{direction}")
          end
        end
      end
      query
    else
      query.order(default_order)
    end
  end

  # Проверка валидности поля для сортировки
  def self.valid_sort_field?(query, field, direction, allowed_sort_fields = nil)
    field_str = field.to_s
    direction_valid = ['asc', 'desc'].include?(direction.to_s.downcase)
    
    return false unless direction_valid
    
    # Если указаны разрешенные поля, проверяем их
    if allowed_sort_fields
      return allowed_sort_fields.include?(field_str)
    end
    
    # Иначе проверяем только поля основной таблицы
    query.klass.column_names.include?(field_str)
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
      self.error_response("Такого #{obj_str_name} не существует", code: :not_found)
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