class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product

  #количество
  validates :quantity, 
    presence: { message: "не может быть пустым" },
    numericality: { 
      greater_than: 0, 
      message: "должен быть больше 0" 
    }

  #ID заказа
  validates :order_id, 
    presence: { message: "не может быть пустым" }

  #ID продукта
  validates :product_id, 
    presence: { message: "не может быть пустым" }

  #Цена при заказе
  validates :price_at_order, 
    presence: { message: "не может быть пустым" },
    numericality: { 
      greater_than: 0, 
      message: "должен быть больше 0" 
    }
end
