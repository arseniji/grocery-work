class Order < ApplicationRecord
  belongs_to :user  
  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items
  
    validates :status, inclusion: { 
    in: %w[pending processing shipped delivered cancelled],
    message: "%{value} не валидный статус" 
  }
  
  # Или классный метод для получения всех статусов
  def self.valid_statuses
    %w[pending processing shipped delivered cancelled]
  end

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
