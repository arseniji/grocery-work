class JsonAdapterFacade
  ADAPTERS = {
    product: ProductJsonAdapter,
    product_collection: ProductCollectionJsonAdapter,
    error: ErrorJsonAdapter,
  }.freeze
  
  def self.adapt(object, type:, options: {})
    adapter_class = ADAPTERS[type.to_sym] || detect_adapter(object)
    
    if adapter_class.respond_to?(:call)
      adapter_class = adapter_class.call
    end
    
    raise ArgumentError, "Тип адаптера не найден: #{type}" unless adapter_class
    
    adapter_class.new(object).as_json(options)
  end
  
  def self.adapt_collection(collection, type: :product_collection, pagination_meta: {}, options: {})
    adapter_class = ADAPTERS[type.to_sym]
    
    if adapter_class.respond_to?(:call)
      adapter_class = adapter_class.call
    end
    
    adapter_class.new(collection: collection, pagination_meta: pagination_meta).as_json(options: options)
  end
    
    
  private_class_method
    
  def self.detect_adapter(object)
    case object
    when Product then ProductJsonAdapter
    when ErrorObject then ErrorJsonAdapter
    when ActiveRecord::Relation then ProductCollectionJsonAdapter
    when Array then ProductCollectionJsonAdapter
    else
      raise ArgumentError, "Не найден подходящий адаптер для объекта: #{object.class}"
    end
  end
end