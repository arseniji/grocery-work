class User < ApplicationRecord
  has_secure_password
  has_many :orders, dependent: :destroy

  ROLES = %w[customer admin].freeze

  validates :role,
  presence: { message: "не может быть пустым" },
  inclusion: { 
    in: ROLES,
    message: "должна быть одной из доступных ролей: #{ROLES.join(', ')}" 
  }

  validates :login, 
    presence: { message: "не может быть пустым" },
    uniqueness: { 
      case_sensitive: false, 
      message: "уже занят. Попробуйте другой" 
    },
    length: { 
      minimum: 3, 
      maximum: 50,
      too_short: "должен содержать минимум %{count} символа",
      too_long: "не может превышать %{count} символов"
    },
    format: { 
      with: /\A[a-zA-Z0-9_]+\z/,
      message: "может содержать только буквы, цифры и нижнее подчеркивание"
    }
  
  # Телефон
  validates :phone,
    presence: { message: "не может быть пустым" },
    uniqueness: { message: "уже зарегистрирован" },
    format: { 
      with: /\A\+?[\d\s\-\(\)]{10,}\z/,
      message: "должен быть корректным номером телефона"
    }
  
  # Имя и фамилия
  validates :firstname, :lastname,
    presence: { message: "не может быть пустым" },
    length: { 
      minimum: 2, 
      maximum: 50,
      too_short: "должно содержать минимум %{count} символа",
      too_long: "не может превышать %{count} символов"
    },
    format: { 
      with: /\A[а-яА-ЯёЁa-zA-Z\s\-]+\z/,
      message: "может содержать только буквы, дефисы и пробелы"
    }
  
  # Пароль
  validates :password,
    length: { 
      minimum: 6,
      maximum: 72, # ограничение bcrypt
      too_short: "должен содержать минимум %{count} символов",
      too_long: "не может превышать %{count} символов"
    },
    allow_nil: true,
    format: { 
      with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: "должен содержать хотя бы одну заглавную букву, одну строчную и одну цифру"
    }
  
  
  # Колбэки для нормализации данных
  before_validation :normalize_phone
  before_save :downcase_login, :capitalize_names
  
  private
  
  # Нормализация телефона (удаляем всё, кроме цифр)
  def normalize_phone
    return if phone.blank?
    self.phone = phone.gsub(/\D/, '').sub(/\A8/, '7') # превращаем 8 в +7 формат
  end

  def downcase_login
    self.login = login.downcase if login.present?
  end
  
  def capitalize_names
    self.firstname = firstname.strip.split.map(&:capitalize).join(' ') if firstname.present?
    self.lastname = lastname.strip.split.map(&:capitalize).join(' ') if lastname.present?
  end
end