require_relative '../commands/profile_commands' unless defined?(UpdateProfileCommand)

class AdminProfileManager < BaseManager
  extend CustomObservable
  add_observer(ProfileManager)
  add_observer(SessionManager)

  def self.get_profiles(page_size:, number_page:, search: {}, role: '', sorted_fields: {}, search_fields: [])
    users = User.all
    
    result = paginate_with_filters(
      users,
      page_size: page_size,
      number_page: number_page,
      filters: { role: role, search: search }.compact,
      search_fields: search_fields,
      sorted_fields: sorted_fields,
      default_order: { created_at: :desc }
    )
    
    pagination_meta = generate_pagination_meta(
      result[:total_count],
      page_size,
      number_page,
      {
        role: role.presence,
        search: search.presence,
        sorted_fields: sorted_fields.presence
      }.compact
    )
    
    JsonAdapterFacade.adapt_collection(
      result[:results],
      type: :profiles,
      pagination_meta: pagination_meta,
      metadata: {
        filters: pagination_meta[:filters]
      }
    )
  end

  def self.get_profile_info(user_id)
    user = self.find_obj(user_id, User, obj_str_name: "пользователя")
    if !user.is_a?(User)
      return user
    end
    result = notify_observers(:get_me, user)
    return self.extract_object(result, ProfileManager)
  end

  def self.add_profile(user_data, use_command: true, user_id: nil)
    user = User.new(**user_data)
    if user.save
      result = JsonAdapterFacade.adapt(user, 
                          type: :profile, 
                          metadata: {created_at: user.created_at,
                          updated_at: user.updated_at})
      
      # Создаем команду для отмены, если включено
      if use_command && user_id
        command = AddProfileCommand.new(
          user_id: user_id,
          user_data: user_data,
          created_user_id: user.id
        )
        CommandManager.add_command_to_history(command, user_id, result)
      end
      
      result
    else
      self.error_response_validation(user.errors)
    end
  end

  def self.update_profile(user_id, user_data, use_command: true, current_user_id: nil)
    user = self.find_obj(user_id, User, obj_str_name: "пользователя")
    if !user.is_a?(User)
      return user
    elsif user.role == "admin"
      return self.error_response("Невозможно изменить админа", details: {user_id: user_id}, code: :update_error)
    end
    
    # Сохраняем предыдущее состояние для отмены
    previous_user_data = {
      login: user.login,
      phone: user.phone,
      firstname: user.firstname,
      lastname: user.lastname,
      patronymic: user.patronymic,
      role: user.role
    }
    
    result = notify_observers(:update_me, user, user_data)
    extracted_result = self.extract_object(result, ProfileManager)
    
    # Создаем команду для отмены, если включено и операция успешна
    if use_command && current_user_id && extracted_result.is_a?(Hash) && extracted_result[:success] != false
      command = UpdateProfileCommand.new(
        user_id: current_user_id,
        profile_user_id: user_id,
        user_data: user_data,
        previous_user_data: previous_user_data
      )
      CommandManager.execute_command(command, current_user_id)
    end
    
    extracted_result
  end

  def self.delete_profile(user_id, current_user_id, current_session_id, use_command: true)
    user = self.find_obj(user_id, User, obj_str_name: "пользователя")
    if !user.is_a?(User)
      return user
    elsif current_user_id == user.id
      result = notify_observers(:delete_me, current_session_id, user)
      return self.extract_object(result, ProfileManager)
    elsif user.role == "admin"
      return self.error_response("Невозможно удалиить админа", details: {user_id: current_user_id}, code: :delete_error)
    end

    # Сохраняем данные пользователя для отмены
    user_data = {
      login: user.login,
      phone: user.phone,
      firstname: user.firstname,
      lastname: user.lastname,
      patronymic: user.patronymic,
      role: user.role,
      password_digest: user.password_digest,
      created_at: user.created_at,
      updated_at: user.updated_at
    }

    result = notify_observers(:get_session_for_session_id, user.id)
    session = self.extract_object(result, SessionManager)
    if session[0]
      result = notify_observers(:delete_me_profile, session[0].id, user)
      extracted_result = self.extract_object(result, ProfileManager)
    else
      user.destroy
      extracted_result = self.success_response
      if use_command
        command = DeleteProfileCommand.new(
          user_id: current_user_id,
          profile_user_id: user_id,
          current_user_id: current_user_id,
          current_session_id: current_session_id,
          user_data: user_data
        )
        CommandManager.add_command_to_history(command, current_user_id, extracted_result)
      end
    end
    extracted_result
  end

  private_class_method
  def self.default_extract_obj()
    {}
  end
  
end