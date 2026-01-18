require_relative 'base_command' unless defined?(BaseCommand)

# Команда для обновления заказа
unless defined?(UpdateOrderCommand)
  class UpdateOrderCommand < BaseCommand
  def initialize(user_id:, order_id:, order_data:, previous_order_data:, current_user_id:)
    super(user_id: user_id, description: "Обновление заказа ##{order_id}")
    @order_id = order_id
    @order_data = order_data
    @previous_order_data = previous_order_data
    @current_user_id = current_user_id
  end

  def execute
    AdminOrderManager.update_orders(@order_data, nil, @order_id, @current_user_id, use_command: false)
  end

  def undo
    AdminOrderManager.update_orders(@previous_order_data, nil, @order_id, @current_user_id, use_command: false)
  end
  end
end

# Команда для добавления продукта в заказ
unless defined?(AddProductToOrderCommand)
  class AddProductToOrderCommand < BaseCommand
  def initialize(user_id:, product_id:, order_id:, user_id_param:, current_user_id:, quantity: 1)
    super(user_id: user_id, description: "Добавление продукта ##{product_id} в заказ ##{order_id}")
    @product_id = product_id
    @order_id = order_id
    @user_id_param = user_id_param
    @current_user_id = current_user_id
    @quantity = quantity
  end

  def execute
    AdminOrderManager.add_product_orders_items(
      @product_id, 
      @order_id, 
      @user_id_param, 
      @current_user_id, 
      quantity: @quantity,
      use_command: false
    )
  end

  def undo
    # Отмена - удаляем добавленный продукт
    AdminOrderManager.delete_product_order_items(
      @product_id, 
      @order_id, 
      @user_id_param, 
      @current_user_id, 
      quantity_to_remove: @quantity,
      use_command: false
    )
  end
  end
end

# Команда для удаления продукта из заказа
unless defined?(RemoveProductFromOrderCommand)
  class RemoveProductFromOrderCommand < BaseCommand
  def initialize(user_id:, product_id:, order_id:, user_id_param:, current_user_id:, quantity_to_remove:, previous_order_item_data:)
    super(user_id: user_id, description: "Удаление продукта ##{product_id} из заказа ##{order_id}")
    @product_id = product_id
    @order_id = order_id
    @user_id_param = user_id_param
    @current_user_id = current_user_id
    @quantity_to_remove = quantity_to_remove
    @previous_order_item_data = previous_order_item_data
  end

  def execute
    AdminOrderManager.delete_product_order_items(
      @product_id, 
      @order_id, 
      @user_id_param, 
      @current_user_id, 
      quantity_to_remove: @quantity_to_remove,
      use_command: false
    )
  end

  def undo
    # Отмена - восстанавливаем удаленный продукт
    if @previous_order_item_data[:was_destroyed]
      # Если элемент был полностью удален, создаем его заново
      order = Order.find(@order_id)
      product = Product.find(@product_id)
      
      # Проверяем наличие товара на складе
      if product.quantity < @previous_order_item_data[:quantity]
        return { success: false, message: "Недостаточно товара на складе для восстановления" }
      end
      
      order_item = OrderItem.new(
        order_id: @order_id,
        product_id: @product_id,
        quantity: @previous_order_item_data[:quantity],
        price_at_order: @previous_order_item_data[:price_at_order]
      )
      order_item.save!
      
      # Забираем товар со склада
      product.update!(quantity: product.quantity - @previous_order_item_data[:quantity])
      
      AdminOrderManager.fetch_updated_order(@user_id_param, @order_id)
    else
      # Если была изменена только количество, восстанавливаем
      order_item = OrderItem.find(@previous_order_item_data[:order_item_id])
      product = Product.find(@product_id)
      
      # Проверяем наличие товара на складе
      if product.quantity < @quantity_to_remove
        return { success: false, message: "Недостаточно товара на складе для восстановления" }
      end
      
      order_item.update!(
        quantity: @previous_order_item_data[:quantity],
        price_at_order: @previous_order_item_data[:price_at_order]
      )
      
      # Забираем товар со склада
      product.update!(quantity: product.quantity - @quantity_to_remove)
      
      AdminOrderManager.fetch_updated_order(@user_id_param, @order_id)
    end
  end
  end
end
