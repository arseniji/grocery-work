class ProfileManager < BaseManager
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
          self.error_response_validation(user.errors)
        end
      rescue => e
        self.error_response("Произошла ошибка при обновлении: #{e.message}", details: {user_id: user.id}, code: :update_error)
      end
  end

  def self.delete_me_profile(session_id, user)
    notify_observers(:logout, session_id, user.id)
    user.destroy
    self.success_response
  end
end