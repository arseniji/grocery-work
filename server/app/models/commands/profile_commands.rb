require_relative 'base_command' unless defined?(BaseCommand)

# Команда для обновления профиля
unless defined?(UpdateProfileCommand)
  class UpdateProfileCommand < BaseCommand
  def initialize(user_id:, profile_user_id:, user_data:, previous_user_data:)
    super(user_id: user_id, description: "Обновление профиля пользователя ##{profile_user_id}")
    @profile_user_id = profile_user_id
    @user_data = user_data
    @previous_user_data = previous_user_data
  end

  def execute
    AdminProfileManager.update_profile(@profile_user_id, @user_data, use_command: false)
  end

  def undo
    AdminProfileManager.update_profile(@profile_user_id, @previous_user_data, use_command: false)
  end
  end
end

# Команда для удаления профиля
unless defined?(DeleteProfileCommand)
  class DeleteProfileCommand < BaseCommand
  def initialize(user_id:, profile_user_id:, current_user_id:, current_session_id:, user_data:)
    super(user_id: user_id, description: "Удаление профиля пользователя ##{profile_user_id}")
    @profile_user_id = profile_user_id
    @current_user_id = current_user_id
    @current_session_id = current_session_id
    @user_data = user_data
  end

  def execute
    AdminProfileManager.delete_profile(@profile_user_id, @current_user_id, @current_session_id, use_command: false)
  end

  def undo
    # Отмена - восстанавливаем профиль
    begin
      # Проверяем, существует ли пользователь
      existing_user = User.find_by(id: @profile_user_id)
      if existing_user
        # Если пользователь существует, обновляем его
        existing_user.update_columns(@user_data)
        return { success: true, message: "Профиль восстановлен" }
      end
      
      # Если пользователь не существует, создаем его с указанным ID
      # Используем insert_all для прямого создания записи с ID
      user_attributes = @user_data.merge(
        id: @profile_user_id
      )
      
      # Используем insert_all для создания записи с указанным ID
      # record_timestamps: false, так как мы уже сохранили timestamps в user_data
      User.insert_all([user_attributes], record_timestamps: false)
      
      { success: true, message: "Профиль восстановлен" }
    rescue => e
      { success: false, message: "Ошибка при восстановлении профиля: #{e.message}" }
    end
  end
  end
end

# Команда для добавления профиля
unless defined?(AddProfileCommand)
  class AddProfileCommand < BaseCommand
  def initialize(user_id:, user_data:, created_user_id: nil)
    super(user_id: user_id, description: "Добавление профиля")
    @user_data = user_data
    @created_user_id = created_user_id
  end

  def execute
    result = AdminProfileManager.add_profile(@user_data, use_command: false, user_id: nil)
    # Сохраняем ID созданного пользователя для отмены
    if result.is_a?(Hash) && result[:success] && result[:user_id]
      @created_user_id = result[:user_id]
    elsif result.is_a?(Hash) && result[:success]
      # Пытаемся найти пользователя по логину, если user_id не вернулся
      user = User.find_by(login: @user_data[:login])
      @created_user_id = user.id if user
    end
    result
  end

  def undo
    # Отмена - удаляем созданный профиль
    if @created_user_id
      # Для удаления нужен current_user_id и current_session_id, используем user_id из команды
      AdminProfileManager.delete_profile(@created_user_id, @user_id, nil, use_command: false)
    else
      { success: false, message: "Не удалось отменить: профиль не был создан" }
    end
  end
  end
end
