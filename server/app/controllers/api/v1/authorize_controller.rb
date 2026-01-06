class Api::V1::AuthorizeController < ApplicationController

  skip_before_action :verify_authenticity_token
  
  def authorizate
    begin
      request_context = build_request_context
      auth_result = AuthManager.authorizate(
            login: params[:login],
            password: params[:password],
            request_context: request_context
        )
        render json: format_auth_response(auth_result), status: :created
    rescue AuthManager::AuthenticationError => e
      render json: { 
        success: false, 
        error: e.message 
      }, status: :unauthorized
    end
  end

  private
  
  def build_request_context
    {
      user_agent: request.user_agent,
      ip_address: request.remote_ip,
      timestamp: Time.current
    }
  end


  def format_auth_response(auth_result)
    {
      success: true,
      user: {
        id: auth_result[:user].id,
        login: auth_result[:user].login,
      },
      session: {
        session_id: auth_result[:session]&.id,
        expires_at: auth_result[:session]&.expires_at
      },
    }
  end
end