class Product < ApplicationRecord
  has_many :order_items, dependent: :destroy
  has_many :orders, through: :order_items
  
  validates :product_name, :price, :measurement_unit, presence: true
  validates :price, numericality: { greater_than: 0 }
end
