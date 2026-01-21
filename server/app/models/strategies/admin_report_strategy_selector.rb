require_relative 'admin_report_products_strategy'
require_relative 'admin_report_users_strategy'
require_relative 'admin_report_orders_strategy'

class AdminReportStrategySelector
  def self.create_strategy(symbolic_strategy_name)
    case symbolic_strategy_name
    when :products
      return AdminReportProductsStrategy.new
    when :orders
      return AdminReportOrdersStrategy.new
    when :users
      return AdminReportUsersStrategy.new
    else
      return nil
    end
  end
end