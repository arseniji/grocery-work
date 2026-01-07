class BaseJsonAdapter
  def initialize(object)
    @object = object
  end

  def to_json(options = {})
    as_json(options).to_json
  end
  
  def as_json(options = {})
    raise NotImplementedError, "Subclasses must implement #as_json"
  end
  
end