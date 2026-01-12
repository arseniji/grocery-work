class Api::V1::ProfileController < Api::V1::BaseController
  
  def get_me
    result = ProfileManager.get_me(@current_user)
    render json: result
  end

  def update_me
    user_data = {
      login: params[:login],
      phone: params[:phone],
      firstname: params[:firstname],
      lastname: params[:lastname],
      patronymic: params[:patronymic],
    }
    result = ProfileManager.update_me(@current_user, user_data)
    render json: result
  end

  def delete_me_profile
    result = ProfileManager.delete_me_profile(@current_session_id, @current_user)
    render json: result
  end
end