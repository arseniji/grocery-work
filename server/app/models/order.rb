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
  
  validates :status, presence: true
end
