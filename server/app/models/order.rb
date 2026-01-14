class Order < ApplicationRecord
  belongs_to :user  
  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items
  
  enum :status, {
    pending: 'pending',
    processing: 'processing', 
    shipped: 'shipped',
    delivered: 'delivered',
    cancelled: 'cancelled'
  }

  #Статус
  validates :status, 
      presence: { message: "не может быть пустым" },
      inclusion: { 
        in: statuses.keys, 
        message: "должен быть одним из допустимых статусов" 
      }

  #ID заказчика
  validates :user_id, 
    presence: { 
      message: "не может быть пустым" 
    }

  #Описание
  validates :description, 
    allow_nil: true,
    length: { 
      maximum: 500,
      too_long: "не может превышать %{count} символов"
    }
end
