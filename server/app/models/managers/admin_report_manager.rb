require_relative '../strategies/admin_report_strategy_selector'
class AdminReportManager < BaseManager
  def self.get_report(report_strategy_symbolic)
    context = Context.new(AdminReportStrategySelector.create_strategy(report_strategy_symbolic))
    if context.strategy.nil?
      return self.error_response("Не существует отчёта для запрашиваемого домена", code: :not_found)
    end
    data = context.gather_report_data
    return data
  end

  class Context
    attr_reader :strategy
    def initialize(strategy)
      @strategy = strategy
    end

    def strategy=(strategy)
      @strategy = strategy
    end

    def gather_report_data
      return @strategy.gather_report_data
    end
  end
end