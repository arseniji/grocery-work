class User < ApplicationRecord
  has_secure_password
  has_many :orders, dependent: :destroy
  validates :login, presence: true, uniqueness: true
  validates :phone, presence: true, uniqueness: true
  validates :firstname, :lastname, presence: true
  validates :password, length: { minimum: 6 }, allow_nil: true

end
