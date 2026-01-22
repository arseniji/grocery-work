class AdminReportJsonAdapter < BaseJsonAdapter
  def as_json(**options)
    return {
      metrics: @object.report_metrics
    }.merge(options.fetch(:metadata, {}))
  end
end