class Api::V1::AdminProfileController < Api::V1::AdminBaseController
  
  def get_profiles
    search_hash = params[:search].to_s.split(',').map { |pair| pair.split(':', 2) }.to_h.transform_values(&:strip) rescue {}
    sorted_fields_parsed = params[:sort].to_s.split(',').map { |pair| pair.split(':', 2) }.to_h.transform_values(&:strip) rescue {}

    reuslt = AdminProfileManager.get_profiles(
      page_size: params[:page_size] || 50,
      number_page: params[:page] || 1,
      role: params[:role],
      search: search_hash,
      sorted_fields: sorted_fields_parsed || {},
      search_fields: ['id', 'login', 'phone', 'firstname', 'lastname', 'patronymic']
    )
    render json: reuslt
  end

  def get_profile_info
    result = AdminProfileManager.get_profile_info(params[:user_id])
    render json: result
  end

  def add_profile
    user_data = build_profile_data(params)
    user_data[:password] = params[:password]
    user_data[:password_confirmation] = params[:password]
    result = AdminProfileManager.add_profile(user_data)
    render json: result
  end

  def update_profile
    user_data = build_profile_data(params)
    user_id = params[:user_id]
    result = AdminProfileManager.update_profile(user_id, user_data)
    render json: result
  end

  def delete_profile
     user_id = params[:user_id]
     result = AdminProfileManager.delete_profile(user_id, @current_user.id, @current_session_id)
     render json: result
  end

  private
  def build_profile_data(params)
    {
      login: params[:login],
      phone: params[:phone],
      firstname: params[:firstname],
      lastname: params[:lastname],
      patronymic: params[:patronymic],
      role: params[:role]
    }
  end
end