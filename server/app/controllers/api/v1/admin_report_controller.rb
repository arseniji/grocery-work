class Api::V1::AdminReportController < Api::V1::AdminBaseController
  before_action :authenticate_admin!

  def get_report()
    result = AdminReportManager.get_report(params[:domain].to_sym)
    render json: result
  end
end

