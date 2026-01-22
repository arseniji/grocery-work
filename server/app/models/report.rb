class Report
  class ReportError < StandardError; end
  class ReportArgumentError < ArgumentError; end

  attr_reader :report_metrics

  def initialize(report_metrics: {})
    @report_metrics = report_metrics
  end

  def add_metric(key, value)
    if key.nil? || value.nil?
      raise ReportArgumentError, "Metrics must not be null key value pairs"
    end
    if @report_metrics.key?(key)
      raise ReportError, "Metric #{key} already exists"
    end
    @report_metrics[key] = value
  end
end