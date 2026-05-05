class ImportExportManager < BaseManager
  require 'json'

  SUPPORTED_ENTITIES = {
    'product' => Product,
    'products' => Product,
    'order' => Order,
    'orders' => Order,
    'order_item' => OrderItem,
    'order_items' => OrderItem,
    'user' => User,
    'users' => User
  }.freeze

  SUPPORTED_FORMATS = %w[json xml].freeze

  def self.export(entity:, format: 'json')
    model = resolve_entity(entity)
    return model unless model.is_a?(Class)

    normalized_format = normalize_format(format)
    return unsupported_format_response(normalized_format || format) unless normalized_format

    records = model.all

    case normalized_format
    when 'json'
      export_json(entity, records)
    when 'xml'
      export_xml(entity, records)
    end
  rescue => e
    error_response("Ошибка экспорта данных: #{e.message}", code: :export_error)
  end

  def self.import(entity:, format:, io:)
    model = resolve_entity(entity)
    return model unless model.is_a?(Class)

    normalized_format = normalize_format(format)
    return unsupported_format_response(normalized_format || format) unless normalized_format

    raw_content = io.read
    rows = parse_rows(raw_content, format: normalized_format)

    return error_response("Файл не содержит данных для импорта", code: :empty_import) if rows.blank?

    errors = []

    ApplicationRecord.transaction do
      rows.each_with_index do |row, index|
        attributes = sanitize_attributes(row, model)

        if attributes.blank?
          errors << {
            index: index + 1,
            message: "В записи нет полей, подходящих для сущности #{model.name}",
            row: row
          }
          next
        end

        record = model.new(attributes)

        unless record.save
          errors << {
            index: index + 1,
            message: record.errors.full_messages.join(', '),
            attributes: attributes
          }
        end
      end

      raise ActiveRecord::Rollback if errors.any?
    end

    return error_response(
      "Ошибки при импорте данных",
      code: :import_validation_error,
      details: { errors: errors }
    ) if errors.any?

    success_response
  rescue JSON::ParserError, REXML::ParseException => e
    error_response("Ошибка парсинга файла: #{e.message}", code: :parse_error)
  rescue => e
    error_response("Ошибка импорта данных: #{e.message}", code: :import_error)
  end

  private_class_method

  def self.resolve_entity(entity)
    model = SUPPORTED_ENTITIES[entity.to_s.downcase]
    return model if model

    error_response(
      "Неизвестная сущность для импорта/экспорта: #{entity}",
      details: { entity: entity, allowed: SUPPORTED_ENTITIES.keys.uniq },
      code: :unknown_entity
    )
  end

  def self.normalize_format(format)
    fmt = format.to_s.downcase
    return fmt if SUPPORTED_FORMATS.include?(fmt)
  end

  def self.unsupported_format_response(format)
    error_response(
      "Неподдерживаемый формат файла: #{format}",
      details: { format: format, allowed: SUPPORTED_FORMATS },
      code: :unsupported_format
    )
  end

  def self.export_json(entity, records)
    # Для JSON отдаем простой массив хэшей с атрибутами — формат максимально
    # близкий к тому, как данные заданы в db/seeds.rb (массив хэшей).
    data = records.map(&:attributes)

    {
      content: JSON.pretty_generate(data),
      filename: build_filename(entity, 'json'),
      content_type: 'application/json'
    }
  end

  def self.export_xml(entity, records)
    # В Rails 8 XML‑сериализация моделей по умолчанию убрана, поэтому
    # сериализуем именно атрибуты, а не объекты (#<Product ...> и т.п.).
    data = records.map(&:attributes)

    # Array#to_xml с root: "products" даст структуру:
    # <products><product>...</product>...</products>
    xml = data.to_xml(
      root: entity.to_s.pluralize,
      skip_types: true,
      dasherize: false
    )

    {
      content: xml,
      filename: build_filename(entity, 'xml'),
      content_type: 'application/xml'
    }
  end

  def self.build_filename(entity, extension)
    timestamp = Time.current.strftime('%Y%m%d%H%M%S')
    "#{entity.to_s.pluralize}-#{timestamp}.#{extension}"
  end

  def self.parse_rows(raw_content, format:)
    case format
    when 'json'
      data = JSON.parse(raw_content)
      normalize_parsed_data(data)
    when 'xml'
      data = Hash.from_xml(raw_content)
      normalize_parsed_data(data)
    else
      []
    end
  end

  def self.normalize_parsed_data(data)
    case data
    when Array
      data
    when Hash
      array_candidate = data.values.find { |value| value.is_a?(Array) } || [data]
      array_candidate
    else
      []
    end
  end

  def self.sanitize_attributes(row, model)
    attrs = row.is_a?(Hash) ? row : {}
    # Convert camelCase keys to snake_case so imported files from the API work
    attrs = attrs.transform_keys { |k| k.to_s.underscore.to_sym }

    allowed_columns =
      model.column_names
           .map(&:to_sym)
           .reject { |col| %i[id created_at updated_at].include?(col) }

    attrs.slice(*allowed_columns)
  end
end