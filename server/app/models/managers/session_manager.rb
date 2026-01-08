class SessionManager
  def self.user_registered(user, request_context = {})
    session = Session.create_for_user(
      user, 
      request_context.merge(custom: { registration_time: Time.current })
    )
        
    session.save
    session
  end
  
  def self.user_authenticated(user, request_context = {})
    session = Session.create_for_user(
      user,
      request_context.merge(custom: { 
        login_time: Time.current,
        auth_method: 'password'
      })
    )
    session.save
    session
  end

  def self.session_authenticate_request(session_id, request_context = {})
    session = Session.find(session_id)
    return nil unless session
    session.renew if session.expired?
    session
  end

  def self.session_expire?(session_id)
    session = Session.find(session_id)
    if not session
      return nil
    end
    session.expired?
  end
  
  def self.user_logout(session_id, user_id)
    session = Session.find(session_id)
    session&.destroy
  end
end
