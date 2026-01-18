class BaseCommand
  attr_reader :command_id, :user_id, :timestamp, :description

  def initialize(user_id:, description: '')
    @command_id = SecureRandom.uuid
    @user_id = user_id
    @timestamp = Time.current
    @description = description
  end

  # Выполнить команду
  def execute
    raise NotImplementedError, "Subclasses must implement #execute"
  end

  # Отменить команду
  def undo
    raise NotImplementedError, "Subclasses must implement #undo"
  end

  # Повторить команду (для redo)
  def redo
    execute
  end

  def to_h
    {
      command_id: @command_id,
      user_id: @user_id,
      timestamp: @timestamp,
      description: @description,
      command_type: self.class.name
    }
  end
end
