class Api::V1::RegistrationController < ApplicationController

  skip_before_action :verify_authenticity_token
  
  def registration
    request_context = build_request_context
    auth_result = AuthManager.registration(
        login: params[:login],
        phone: params[:phone],
        role: params[:role],
        password: params[:password],
        firstname: params[:firstname],
        lastname: params[:lastname],
        patronymic: params[:patronymic],
        request_context: request_context
      )
      render json: auth_result
  end

  def build_request_context
    {
      user_agent: request.user_agent,
      ip_address: request.remote_ip,
      timestamp: Time.current
    }
  end
end