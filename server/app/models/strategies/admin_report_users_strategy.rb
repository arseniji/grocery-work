require_relative 'admin_report_strategy'

class AdminReportUsersStrategy < AdminReportStrategy
  def gather_report_data(report_obj)
    super(report_obj)
    report_obj.add_metric(:total_users, total_users_count)
    report_obj.add_metric(:users_by_role, users_count_by_role)
    report_obj.add_metric(:recent_registrations, recent_registrations_stats)
    report_obj.add_metric(:top_users_by_orders, top_users_by_orders_count)
    report_obj.add_metric(:role_distribution_percentage, role_distribution_percentage)
  end

  private

  def total_users_count
    User.count
  end

  def users_count_by_role
    User.group(:role).count
  end

  def recent_registrations_stats
    {
      last_24_hours: User.where('created_at >= ?', 24.hours.ago).count,
      last_7_days: User.where('created_at >= ?', 7.days.ago).count,
      last_30_days: User.where('created_at >= ?', 30.days.ago).count
    }
  end

  def top_users_by_orders_count
    User.left_joins(:orders)
        .group('users.id', 'users.login', 'users.firstname', 'users.lastname')
        .select('users.id, users.login, users.firstname, users.lastname, COUNT(orders.id) as orders_count')
        .order('orders_count DESC')
        .limit(10)
        .map { |u| { id: u.id, login: u.login, name: "#{u.firstname} #{u.lastname}", orders_count: u.orders_count } }
  end

  def role_distribution_percentage
    total = User.count.to_f
    return {} if total.zero?

    User.group(:role).count.transform_values do |count|
      calculate_percentage(count, total)
    end
  end

  def calculate_percentage(part, whole)
    return 0 if whole.zero?
    ((part.to_f / whole) * 100).round(2)
  end
end