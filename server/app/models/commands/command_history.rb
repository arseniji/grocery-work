class CommandHistory
  attr_reader :user_id

  def initialize(user_id)
    @user_id = user_id
    @history = []
    @current_index = -1
  end

  # Добавить команду в историю
  def add_command(command)
    # Удаляем все команды после текущего индекса (если были отмены)
    @history = @history[0..@current_index] if @current_index >= 0
    @history << command
    @current_index = @history.size - 1
  end

  # Отменить последнюю команду
  def undo
    return nil if @current_index < 0

    command = @history[@current_index]
    result = command.undo
    @current_index -= 1
    { command: command, result: result }
  end

  # Повторить отмененную команду
  def redo
    return nil if @current_index >= @history.size - 1

    @current_index += 1
    command = @history[@current_index]
    result = command.redo
    { command: command, result: result }
  end

  # Проверить, можно ли отменить
  def can_undo?
    @current_index >= 0
  end

  # Проверить, можно ли повторить
  def can_redo?
    @current_index < @history.size - 1
  end

  # Получить историю команд
  def get_history
    @history.map(&:to_h)
  end

  # Очистить историю
  def clear
    @history = []
    @current_index = -1
  end
end
