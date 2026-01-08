class JsonAdapterFacade
  ADAPTERS = {
    product: ProductJsonAdapter,
    product_collection: ProductCollectionJsonAdapter,
    error: ErrorJsonAdapter,
    cart_product: CartProductJsonAdapter,
    cart: CartCollectionJsonAdapter,
    successful: SuccessfulJsonAdapter,
    category: CategoryJsonAdapter,
    categories: CategoryCollectionJsonAdapter
  }.freeze
  
  def self.adapt(object, type:, **options)
    adapter_class = ADAPTERS[type.to_sym] || detect_adapter(object)
    
    raise ArgumentError, "Тип адаптера не найден: #{type}" unless adapter_class
    
    adapter = adapter_class.new(object)
    
    # Передаем все опции в адаптер
    if adapter.respond_to?(:as_json)
      adapter.as_json(**options)
    else
      adapter.as_json(options)
    end
  end
  
  def self.adapt_collection(collection, type: :product_collection, **options)
    adapter_class = ADAPTERS[type.to_sym] || detect_adapter(collection)
    
    raise ArgumentError, "Тип адаптера не найден: #{type}" unless adapter_class
    
    adapter = adapter_class.new(collection: collection, **options)
    
    if adapter.respond_to?(:as_json)
      adapter.as_json(**options)
    else
      adapter.as_json(options)
    end
  end
    
  private_class_method
    
  def self.detect_adapter(object)
    case object
    when Product then ProductJsonAdapter
    when Cart then CartCollectionJsonAdapter
    when ErrorObject then ErrorJsonAdapter
    when Array then ProductCollectionJsonAdapter
    when Category then CategoryJsonAdapter
    else
      raise ArgumentError, "Не найден подходящий адаптер для объекта: #{object.class}"
    end
  end
end