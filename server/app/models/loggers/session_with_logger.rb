class SessionWithLogger < BaseSession
  def initialize(session, logger_path: nil)
    @session = session
    @session_logger = setup_logger(logger_path)

    @id = session.id
    @user_id = session.user_id
    @data = session.data
    @expires_at = session.expires_at
  end

  def save
    log_action(:save, "Попытка сохранения сессии")
    result = @session.save
    log_action(:save, "Сессия успешно сохранена", success: true)
    result
  rescue => e
    log_action(:save, "Ошибка сохранения: #{e.message}", error: true)
    raise
  end

  def destroy
    log_action(:destroy, "Попытка удаления сессии")
    result = @session.destroy
    log_action(:destroy, "Сессия успешно удалена", success: true)
    result
  rescue => e
    log_action(:destroy, "Ошибка удаления: #{e.message}", error: true)
    raise
  end

  def update(data)
    log_action(:update, "Попытка обновления сессии с данными: #{data.inspect}")
    result = @session.update(data)
    log_action(:update, "Сессия успешно обновлена", success: true)
    result
  rescue => e
    log_action(:update, "Ошибка обновления: #{e.message}", error: true)
    raise
  end

  def expired?
    result = @session.expired?
    log_action(:expired?, "Проверка истечения сессии: #{result}")
    result
  end

  def renew(duration = 2.weeks)
    log_action(:renew, "Попытка продления сессии на #{duration}")
    result = @session.renew(duration)
    log_action(:renew, "Сессия успешно продлена до #{@session.expires_at}", success: true)
    result
  rescue => e
    log_action(:renew, "Ошибка продления: #{e.message}", error: true)
    raise
  end

  def to_client
    log_action(:to_client, "Преобразование сессии для клиента")
    @session.to_client
  end

  def valid?
    result = @session.valid?
    log_action(:valid?, "Проверка валидности сессии: #{result}")
    result
  end

  def touch
    log_action(:touch, "Обновление времени последней активности")
    result = @session.touch
    log_action(:touch, "Активность обновлена", success: true)
    result
  rescue => e
    log_action(:touch, "Ошибка обновления активности: #{e.message}", error: true)
    raise
  end

  def cart
    @session.cart
  end

  def cart=(new_cart)
    @session.cart = new_cart
  end

  def clear_cart
    log_action(:clear_cart, "Очистка корзины")
    result = @session.clear_cart
    log_action(:clear_cart, "Корзина очищена", success: true)
    result
  rescue => e
    log_action(:clear_cart, "Ошибка очистки корзины: #{e.message}", error: true)
    raise
  end

  def cart_object
    log_action(:cart_object, "Получение объекта корзины")
    @session.cart_object
  end

  def update_cart(cart_instance)
    log_action(:update_cart, "Обновление корзины")
    result = @session.update_cart(cart_instance)
    log_action(:update_cart, "Корзина обновлена", success: true)
    result
  rescue => e
    log_action(:update_cart, "Ошибка обновления корзины: #{e.message}", error: true)
    raise
  end

  # Делегирование методов класса с передачей Session как аргумента
  def self.find(session_id, session_class = Session)
    logger = new_logger
    logger.info("[#{Time.current}] [FIND] Поиск сессии: #{session_id}")

    result = session_class.find(session_id)

    if result
      logger.info("[#{Time.current}] [FIND] Сессия найдена: #{session_id}")
      new(result)
    else
      logger.warn("[#{Time.current}] [FIND] Сессия не найдена: #{session_id}")
      nil
    end
  rescue => e
    logger.error("[#{Time.current}] [FIND] Ошибка поиска сессии #{session_id}: #{e.message}")
    raise
  end

  def self.create_for_user(user, session_data = {}, session_class = Session)
    logger = new_logger
    logger.info("[#{Time.current}] [CREATE] Создание сессии для пользователя: #{user.id}")

    result = session_class.create_for_user(user, session_data)
    logger.info("[#{Time.current}] [CREATE] Сессия создана: #{result.id}")

    new(result)
  rescue => e
    logger.error("[#{Time.current}] [CREATE] Ошибка создания сессии для пользователя #{user.id}: #{e.message}")
    raise
  end

  def self.find_by_user(user_id, session_class = Session)
    logger = new_logger
    logger.info("[#{Time.current}] [FIND_BY_USER] Поиск всех сессий пользователя: #{user_id}")

    results = session_class.find_by_user(user_id)
    logger.info("[#{Time.current}] [FIND_BY_USER] Найдено сессий: #{results.count}")

    results.map { |session| new(session) }
  rescue => e
    logger.error("[#{Time.current}] [FIND_BY_USER] Ошибка поиска сессий пользователя #{user_id}: #{e.message}")
    raise
  end

  def self.destroy_all_for_user(user_id, session_class = Session)
    logger = new_logger
    logger.info("[#{Time.current}] [DESTROY_ALL] Удаление всех сессий пользователя: #{user_id}")

    result = session_class.destroy_all_for_user(user_id)
    logger.info("[#{Time.current}] [DESTROY_ALL] Все сессии пользователя #{user_id} удалены")

    result
  rescue => e
    logger.error("[#{Time.current}] [DESTROY_ALL] Ошибка удаления сессий пользователя #{user_id}: #{e.message}")
    raise
  end

  def self.cleanup_expired(session_class = Session)
    logger = new_logger
    logger.info("[#{Time.current}] [CLEANUP_EXPIRED] Очистка просроченных сессий")

    result = session_class.cleanup_expired
    logger.info("[#{Time.current}] [CLEANUP_EXPIRED] Очистка завершена")

    result
  rescue => e
    logger.error("[#{Time.current}] [CLEANUP_EXPIRED] Ошибка очистки: #{e.message}")
    raise
  end

  private

  def setup_logger(logger_path)
    path = logger_path || ENV['SESSION_LOG_PATH'] || 'log/sessions.log'

    FileUtils.mkdir_p(File.dirname(path))

    Logger.new(path, 'daily').tap do |logger|
      logger.formatter = proc do |severity, datetime, progname, msg|
        "[#{datetime}] [#{severity}] #{msg}\n"
      end
    end
  end

  def self.new_logger
    path = ENV['SESSION_LOG_PATH'] || 'log/sessions.log'
    FileUtils.mkdir_p(File.dirname(path))

    Logger.new(path, 'daily').tap do |logger|
      logger.formatter = proc do |severity, datetime, progname, msg|
        "[#{datetime}] [#{severity}] #{msg}\n"
      end
    end
  end

  def log_action(method, message, success: false, error: false)
    level = error ? :error : (success ? :info : :debug)
    @session_logger.send(level, format_log_message(method, message))
  end

  def format_log_message(method, message)
    "[#{Time.current}] [#{method.to_s.upcase}] Session ID: #{@id} | User ID: #{@user_id} | #{message}"
  end
end