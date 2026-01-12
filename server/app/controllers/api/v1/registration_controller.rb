class Api::V1::RegistrationController < ApplicationController

  skip_before_action :verify_authenticity_token
  
  def registration
    request_context = build_request_context

    begin
      auth_result = AuthManager.registration(
        login: params[:login],
        phone: params[:phone],
        password: params[:password],
        firstname: params[:firstname],
        lastname: params[:lastname],
        patronymic: params[:patronymic],
        request_context: request_context
      )
      
      render json: format_register_response(auth_result), status: :created
      
    rescue AuthManager::RegistrationError => e
      render json: { 
        success: false, 
        error: e.message 
      }, status: :unprocessable_entity
    end
  end

  def build_request_context
    {
      user_agent: request.user_agent,
      ip_address: request.remote_ip,
      timestamp: Time.current
    }
  end

  def format_register_response(auth_result)
    {
      success: true,
      user: {
        id: auth_result[:user].id,
        login: auth_result[:user].login,
        firstname: auth_result[:user].firstname,
        lastname: auth_result[:user].lastname,
        phone: auth_result[:user].phone
      },
      session: {
        session_id: auth_result[:session]&.id,
        expires_at: auth_result[:session]&.expires_at
      },
    }
  end
end