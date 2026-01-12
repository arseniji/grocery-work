class ProfileManager
  extend CustomObservable

  add_observer(AuthManager)
  
  def self.get_me(user)
    JsonAdapterFacade.adapt(user, 
                            type: :profile, 
                            metadata: {created_at: user.created_at,
                            updated_at: user.updated_at})
  end

  def self.update_me(user, user_data)
      begin
        if user.update(user_data)
          JsonAdapterFacade.adapt(user, 
                                  type: :profile, 
                                  metadata: {
                                    created_at: user.created_at,
                                    updated_at: user.updated_at
                                  })
        else
          error_response_validation(user.errors)
        end
      rescue => e
        error_response("Произошла ошибка при обновлении: #{e.message}", user.id, code: :update_error)
      end
  end

  def self.delete_me_profile(session_id, user)
    notify_observers(:logout, session_id, user.id)
    user.destroy
    self.success_response
  end

  private_class_method
  def self.error_response(message, user_id, code: :not_found_order)
      error = ErrorObject.new(
        message: message, 
        code: code,
        details: { user_id: user_id }
      )
      JsonAdapterFacade.adapt(error, type: :error)
  end

  def self.error_response_validation(errors)
    error_details = errors.messages.map do |field, messages|
      {
        field: field,
        messages: messages,
        full_messages: errors.full_messages_for(field)
      }
    end
    
    error = ErrorObject.new(
      message: "Ошибка валидации данных",
      code: :validation_error,
      details: {
        errors: error_details,
        full_messages: errors.full_messages
      }
    )
    
    JsonAdapterFacade.adapt(error, type: :error)
  end

  def self.success_response
      JsonAdapterFacade.adapt(nil, type: :successful)
  end

end