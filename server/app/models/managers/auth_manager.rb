class AuthManager < BaseManager
  extend CustomObservable

  add_observer(SessionManager)
  

  def self.authorizate(login:, password:, request_context: {})
    user = self.find_user_by_login(login)
    
    unless user && user.authenticate(password)
      return self.error_response("Не верный логин или пароль", code: :not_authorize)
    end
    results = notify_observers(:user_authenticated, user, request_context)
    session = self.extract_object(results, SessionManager)
    JsonAdapterFacade.adapt(
      user, 
      type: :authorizate,
      session: session,
    )
  end
  

  def self.registration(login:, phone:, password:, firstname:, lastname:, patronymic: nil, role: 'customer',request_context: {})
      user = User.new(
      login: login,
      phone: phone,
      password: password,
      password_confirmation: password,
      firstname: firstname,
      lastname: lastname,
      patronymic: patronymic,
      role: role
    )
    
    if user.save
      results = notify_observers(:user_registered, user, request_context)
      session = self.extract_object(results, SessionManager)
      JsonAdapterFacade.adapt(
        user, 
        type: :registration,
        session: session,
      )
    else
      self.error_response_validation(user.errors)
    end
  end

  def self.authenticate_by_session(session_id:, request_context: {})
    results = notify_observers(:session_authenticate_request, session_id, request_context)
    
    session = self.extract_object(results, SessionManager)
    
    unless session
      return self.error_response("Сессия не найдена", details: {session_id: session_id}, code: :session_not_found)
    end
      user = self.find_obj(session.user_id, User, obj_str_name: "пользователя")
      if user.is_a?(User)
        [user, session]
      else
        return user
      end
  end

  def self.logout(session_id, user_id)
    notify_observers(:user_logout, session_id, user_id)
    self.success_response
  end


  private_class_method
  def self.default_extract_obj
      nil
  end

  def self.find_user_by_login(login)
    User.where('LOWER(login) = ?', login.downcase).first
  end
end