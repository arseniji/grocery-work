require_relative '../report'
class AdminReportStrategy
  def initialize()
  end
  def gather_report_data(report_object)
    unless report_object.is_a?(Report)
      raise ArgumentError, "Object must be Report or their ancestor"
    end
  end
  
  protected
  def add_report_k_v_iterm(report_object, key, value)
    report_object.add_metric(key, value)
  end
end