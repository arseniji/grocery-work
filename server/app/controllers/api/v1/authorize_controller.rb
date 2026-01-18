class Api::V1::AuthorizeController < ApplicationController

  skip_before_action :verify_authenticity_token
  
  def authorizate
    request_context = build_request_context
    auth_result = AuthManager.authorizate(
          login: params[:login],
          password: params[:password],
          request_context: request_context
      )
      render json: auth_result
  end

  private
  
  def build_request_context
    {
      user_agent: request.user_agent,
      ip_address: request.remote_ip,
      timestamp: Time.current
    }
  end
end