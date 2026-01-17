require_relative '../commands/command_history'
class CommandManager
  @@histories = {} # Хранилище историй команд для каждого пользователя

  # Получить историю команд для пользователя
  def self.get_history(user_id)
    @@histories[user_id] ||= CommandHistory.new(user_id)
  end

  # Выполнить команду и добавить в историю
  def self.execute_command(command, user_id)
    result = command.execute
    
    # Добавляем в историю только если команда выполнена успешно
    # Проверяем разные признаки успеха:
    is_success = if result.is_a?(Hash)
      # Если есть ключ :success, проверяем его значение
      if result.key?(:success)
        result[:success] == true || (result[:success] != false && result[:success] != nil)
      # Если нет ключа :success, но есть полезные данные - считаем успехом
      # Проверяем наличие хотя бы одного полезного ключа (признак успешного выполнения)
      elsif result.key?(:user_id) || result.key?(:id) || result.key?(:order_id) || 
            result.key?(:product_id) || result.key?(:timestamp) || result.key?(:login) ||
            result.key?(:name) || result.key?(:price)
        # Проверяем, что это не ошибка (нет ключей ошибок)
        !result.key?(:code) || !result[:code].to_s.include?('error')
      else
        false
      end
    else
      false
    end
    
    if is_success
      history = get_history(user_id)
      history.add_command(command)
    end
    
    result
  end

  # Добавить команду в историю без выполнения (операция уже выполнена)
  def self.add_command_to_history(command, user_id, operation_result)
    # Проверяем, что операция была успешной
    is_success = if operation_result.is_a?(Hash)
      # Если есть ключ :success, проверяем его значение
      if operation_result.key?(:success)
        operation_result[:success] == true || (operation_result[:success] != false && operation_result[:success] != nil)
      # Если нет ключа :success, но есть полезные данные - считаем успехом
      elsif operation_result.key?(:user_id) || operation_result.key?(:id) || operation_result.key?(:order_id) || 
            operation_result.key?(:product_id) || operation_result.key?(:timestamp) || operation_result.key?(:login) ||
            operation_result.key?(:name) || operation_result.key?(:price)
        # Проверяем, что это не ошибка (нет ключей ошибок)
        !operation_result.key?(:code) || !operation_result[:code].to_s.include?('error')
      else
        false
      end
    else
      false
    end
    
    if is_success
      history = get_history(user_id)
      history.add_command(command)
    end
    
    operation_result
  end

  # Отменить последнюю команду
  def self.undo(user_id)
    history = get_history(user_id)
    return { success: false, message: "Нет команд для отмены" } unless history.can_undo?
    
    undo_result = history.undo
    if undo_result
      {
        success: true,
        command: undo_result[:command].to_h,
        result: undo_result[:result]
      }
    else
      { success: false, message: "Ошибка при отмене команды" }
    end
  end

  # Повторить отмененную команду
  def self.redo(user_id)
    history = get_history(user_id)
    return { success: false, message: "Нет команд для повтора" } unless history.can_redo?
    
    redo_result = history.redo
    if redo_result
      {
        success: true,
        command: redo_result[:command].to_h,
        result: redo_result[:result]
      }
    else
      { success: false, message: "Ошибка при повторе команды" }
    end
  end

  # Получить историю команд пользователя
  def self.get_user_history(user_id)
    history = get_history(user_id)
    {
      success: true,
      history: history.get_history,
      can_undo: history.can_undo?,
      can_redo: history.can_redo?
    }
  end

  # Очистить историю пользователя
  def self.clear_history(user_id)
    history = get_history(user_id)
    history.clear
    { success: true, message: "История команд очищена" }
  end
end
