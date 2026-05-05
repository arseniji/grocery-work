class Product < ApplicationRecord
  has_many :order_items, dependent: :destroy
  has_many :orders, through: :order_items
  
  #Название продукта
  validates :product_name, 
    presence: { message: "не может быть пустым" },
    uniqueness: { message: "Товар уже создан" },
    length: { 
      minimum: 2, 
      maximum: 100,
      too_short: "должен содержать минимум %{count} символа",
      too_long: "не может превышать %{count} символов"
    }

  #цена
  validates :price, 
    presence: { message: "не может быть пустым" },
    numericality: { 
      only_float: true,
      greater_than: 0, 
      message: "должен быть больше 0" 
    }

  #киллограммы
  validates :measurement_unit, 
    presence: { message: "не может быть пустым" },
    length: { 
      minimum: 1, 
      maximum: 10,
      too_short: "должен содержать минимум %{count} символа",
      too_long: "не может превышать %{count} символов"
    }

  #рейтинг
  validates :rating, 
    allow_nil: true,
    numericality: { 
      only_float: true,
      greater_than_or_equal_to: 0, 
      less_than_or_equal_to: 5,
      message: "должен быть от 0 до 5" 
    }

  #категория
  validates :category, 
      presence: { message: "не может быть пустым" },
      inclusion: { 
        in: ['vegetables', 'fruits', 'dairy', 'meat', 'fish', 'grocery', 'drinks', 'bakery'],
        message: "должна быть одной из допустимых категорий"
      }

  #количество товара
  validates :quantity, 
    presence: { message: "не может быть пустым" },
    numericality: { 
      only_integer: true,
      greater_than_or_equal_to: 0, 
      message: "не может быть отрицательным" 
    }

  validates :barcode, uniqueness: { message: "бар код уже существует" }, allow_nil: true

  validates :location,
    allow_nil: true,
    inclusion: {
      in: ['in_store', 'in_warehouse'],
      message: "должна быть одной из допустимых: in_store или in_warehouse"
    }

end
