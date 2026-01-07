class Api::V1::BaseController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_by_session!
  
  attr_reader :current_user, :current_session

  def logout
    AuthManager.logout(
          @current_session_id,
          @current_session.user_id,
        )
        
        render json: { success: true, message: "Вышли из системы" }
        return
  end
  
  private
  
  def authenticate_by_session!
    build_request_context =
      {
        user_agent: request.user_agent,
        ip_address: request.remote_ip,
        request_id: request.request_id,
        timestamp: Time.current,
        controller: controller_name,
        action: action_name
      }
    session_id = extract_token_from_request
    
    unless session_id
      render json: { error: "Отсутствует id сессии" }, status: :unauthorized
      return
    end
    begin
      authenticate_user = AuthManager.authenticate_by_session(session_id: session_id, 
                                                              request_context: build_request_context)
      @current_user = authenticate_user[:user]
      @current_session = authenticate_user[:session]
      @current_session_id = session_id
    rescue AuthManager::SessionNotFoundError => e
      render json: { 
        success: false, 
        error: e.message 
      }, status: :unauthorized
    end
  end
  
  def extract_token_from_request
    auth_header = request.headers['Authorization']
    if auth_header&.start_with?('Bearer ')
      return auth_header.split(' ').last
    end
    
    # 2. Из параметра запроса ?token=...
    params[:token]
    
    # 3. Или из заголовка X-Session-Token
    request.headers['X-Session-Token']
  end
  
end