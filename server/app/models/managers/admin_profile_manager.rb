class AdminProfileManager < BaseManager
  extend CustomObservable
  add_observer(ProfileManager)
  add_observer(SessionManager)

  def self.get_profiles(page_size:, number_page:, search: '', role: '', sorted_fields: {})
    users = User.all
    
    result = paginate_with_filters(
      users,
      page_size: page_size,
      number_page: number_page,
      filters: { role: role }.compact,
      search_fields: ['login', 'firstname', 'lastname', 'phone'],
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

  def self.add_profile(user_data)
    user = User.new(**user_data)
    if user.save
        JsonAdapterFacade.adapt(user, 
                          type: :profile, 
                          metadata: {created_at: user.created_at,
                          updated_at: user.updated_at})
    else
      self.error_response_validation(user.errors)
    end
  end

  def self.update_profile(user_id, user_data)
    user = self.find_obj(user_id, User, obj_str_name: "пользователя")
    if !user.is_a?(User)
      return user
    end
    result = notify_observers(:update_me, user, user_data)
    return self.extract_object(result, ProfileManager)
  end

  def self.delete_profile(user_id, current_user_id, current_session_id)
    user = self.find_obj(user_id, User, obj_str_name: "пользователя")
    if !user.is_a?(User)
      return user
    elsif current_user_id == user.id
      result = notify_observers(:delete_me, current_session_id, user)
      return self.extract_object(result, ProfileManager)
    end

    result = notify_observers(:get_session_for_session_id, user.id)
    session = self.extract_object(result, SessionManager)
    result = notify_observers(:delete_me_profile, session[0].id, user)
    return self.extract_object(result, ProfileManager)
  end

  private_class_method
  def self.default_extract_obj()
    {}
  end
  
end