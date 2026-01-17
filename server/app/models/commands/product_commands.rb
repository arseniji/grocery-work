require_relative 'base_command' unless defined?(BaseCommand)

# Команда для обновления продукта
unless defined?(UpdateProductCommand)
  class UpdateProductCommand < BaseCommand
  def initialize(user_id:, product_id:, product_data:, previous_product_data:)
    super(user_id: user_id, description: "Обновление продукта ##{product_id}")
    @product_id = product_id
    @product_data = product_data
    @previous_product_data = previous_product_data
  end

  def execute
    AdminProductManager.update_product(@product_id, @product_data, use_command: false)
  end

  def undo
    AdminProductManager.update_product(@product_id, @previous_product_data, use_command: false)
  end
  end
end

# Команда для удаления продукта
unless defined?(DeleteProductCommand)
  class DeleteProductCommand < BaseCommand
  def initialize(user_id:, product_id:, product_data:)
    super(user_id: user_id, description: "Удаление продукта ##{product_id}")
    @product_id = product_id
    @product_data = product_data
  end

  def execute
    AdminProductManager.delete_product(@product_id, use_command: false)
  end

  def undo
    # Отмена - восстанавливаем продукт
    product = Product.new(@product_data)
    product.id = @product_id
    product.save(validate: false) # Сохраняем без валидации, чтобы восстановить точное состояние
    AdminProductManager.update_product(@product_id, @product_data, use_command: false)
  end
  end
end

# Команда для добавления продукта
unless defined?(AddProductCommand)
  class AddProductCommand < BaseCommand
  def initialize(user_id:, product_data:, product_id: nil)
    super(user_id: user_id, description: "Добавление продукта")
    @product_data = product_data
    @product_id = product_id
  end

  def execute
    result = AdminProductManager.add_product(@product_data, use_command: false, user_id: nil)
    # Сохраняем ID созданного продукта для отмены
    if result.is_a?(Hash) && result[:success] && result[:id]
      @product_id = result[:id]
    elsif result.is_a?(Hash) && result[:success]
      # Пытаемся найти продукт по данным, если ID не вернулся
      product = Product.find_by(product_name: @product_data[:product_name])
      @product_id = product.id if product
    end
    result
  end

  def undo
    # Отмена - удаляем созданный продукт
    if @product_id
      AdminProductManager.delete_product(@product_id, use_command: false)
    else
      { success: false, message: "Не удалось отменить: продукт не был создан" }
    end
  end
  end
end
