require 'observer'
require_relative 'session_manager' 

class AuthManager
  class AuthenticationError < StandardError; end
  class RegistrationError < StandardError; end
  class SessionNotFoundError < StandardError; end

  extend CustomObservable

  add_observer(SessionManager)
  

  def self.authorizate(login:, password:, request_context: {})
    user = self.find_user_by_login(login)
    
    unless user && user.authenticate(password)
      raise AuthenticationError, "Неверный логин или пароль"
    end
    results = notify_observers(:user_authenticated, user, request_context)
    self.extract_session(results, user)
  end
  

  def self.registration(login:, phone:, password:, firstname:, lastname:, patronymic: nil, request_context: {})
    if self.find_user_by_login(login)
      raise RegistrationError, "Пользователь с логином '#{login}' уже существует"
    end
    

    user = User.new(
      login: login,
      phone: phone,
      password: password,
      password_confirmation: password,
      firstname: firstname,
      lastname: lastname,
      patronymic: patronymic
    )
    
    if user.save
      results = notify_observers(:user_registered, user, request_context)
      self.extract_session(results, user)
    else
      raise RegistrationError, user.errors.full_messages.join(", ")
    end
  end

  def self.authenticate_by_session(session_id:, request_context: {})
    results = notify_observers(:session_authenticate_request, session_id, request_context)
    
    session = results[SessionManager]
    
    unless session
      raise SessionNotFoundError, "Сессия не найдена"
    end
    user = User.find_by(id: session.user_id)
    unless user
      raise AuthenticationError, "Пользователь не найден"
    end
    self.extract_session(results, user)
  end

  def self.logout(session_id, user_id)
    notify_observers(:user_logout, session_id, user_id)
  end


  private_class_method

  def self.extract_session(results, user)
     session = nil
    results.each do |observer, result|
        if observer.is_a?(SessionManager) || observer == SessionManager
          session = result
          break
        end
      end
      
      {
        user: user,
        session: session,
        listeners_results: results
      }

  end

  def self.find_user_by_login(login)
    User.where('LOWER(login) = ?', login.downcase).first
  end
end