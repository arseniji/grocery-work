class Api::V1::AdminBaseController < Api::V1::BaseController
  before_action :authenticate_admin!


  def authenticate_admin!
    if @current_role != "admin"
      result = BaseManager.error_response("У вас не достаточно прав", details: {user_id: @current_user.id, session_id: @current_session_id}, code: :access_error)
      render json: result
    end
  end
end