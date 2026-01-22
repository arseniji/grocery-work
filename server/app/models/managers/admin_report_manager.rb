require_relative '../strategies/admin_report_strategy_selector'
class AdminReportManager < BaseManager
  def self.get_report(report_strategy_symbolic)
    context = Context.new(AdminReportStrategySelector.create_strategy(report_strategy_symbolic))
    if context.strategy.nil?
      return self.error_response("Не существует отчёта для запрашиваемого домена", code: :not_found)
    end
    report = Report.new
    context.gather_report_data(report)
    json_response = JsonAdapterFacade.adapt(
      report,
      type: 'report',
      metadata: { generated_by: 'admin', version: '1.0' }
    )
    return json_response
  end

  class Context
    attr_reader :strategy
    def initialize(strategy)
      @strategy = strategy
    end

    def strategy=(strategy)
      @strategy = strategy
    end

    def gather_report_data(report_obj)
      return @strategy.gather_report_data(report_obj)
    end
  end
end