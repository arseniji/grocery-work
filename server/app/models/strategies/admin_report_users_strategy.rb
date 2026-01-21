require_relative 'admin_report_strategy'

class AdminReportUsersStrategy < AdminReportStrategy
  def gather_report_data
    report_data = {
      total_users: total_users_count,
      users_by_role: users_count_by_role,
      recent_registrations: recent_registrations_stats,
      phone_statistics: phone_statistics,
      login_statistics: login_statistics,
      name_statistics: name_statistics,
      users_with_orders: users_with_orders_stats,
      password_digest_presence: password_digest_stats,
      top_users_by_orders: top_users_by_orders_count,
      role_distribution_percentage: role_distribution_percentage,
      created_at_range: created_at_date_range,
      updated_at_range: updated_at_date_range,
      average_login_length: average_login_length,
      average_name_length: average_name_length,
    }
    json_response = JsonAdapterFacade.adapt_collection(
      report_data,
      type: :admin_report_users,
      metadata: { generated_by: 'admin', version: '1.0' }
    )

    return json_response
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

  def phone_statistics
    {
      total_unique_phones: User.distinct.count(:phone),
      phones_starting_with_7: User.where("phone LIKE ?", "7%").count,
      phones_starting_with_8: User.where("phone LIKE ?", "8%").count
    }
  end

  def login_statistics
    {
      total_unique_logins: User.distinct.count(:login),
      min_login_length: User.minimum("LENGTH(login)"),
      max_login_length: User.maximum("LENGTH(login)"),
      logins_with_underscore: User.where("login LIKE ?", "%_%").count
    }
  end

  def name_statistics
    {
      users_with_firstname: User.where.not(firstname: [nil, '']).count,
      users_with_lastname: User.where.not(lastname: [nil, '']).count,
      most_common_firstnames: User.group(:firstname).order('count_id DESC').limit(5).count(:id),
      most_common_lastnames: User.group(:lastname).order('count_id DESC').limit(5).count(:id)
    }
  end

  def users_with_orders_stats
    {
      users_with_orders: User.joins(:orders).distinct.count,
      users_without_orders: User.left_joins(:orders).where(orders: { id: nil }).count,
      percentage_with_orders: calculate_percentage(
        User.joins(:orders).distinct.count,
        User.count
      )
    }
  end

  def password_digest_stats
    {
      users_with_password: User.where.not(password_digest: nil).count,
      users_without_password: User.where(password_digest: nil).count
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

  def created_at_date_range
    {
      earliest: User.minimum(:created_at),
      latest: User.maximum(:created_at)
    }
  end

  def updated_at_date_range
    {
      earliest: User.minimum(:updated_at),
      latest: User.maximum(:updated_at)
    }
  end

  def average_login_length
    result = User.average("LENGTH(login)")
    result ? result.to_f.round(2) : 0
  end

  def average_name_length
    {
      firstname: User.average("LENGTH(firstname)")&.to_f&.round(2) || 0,
      lastname: User.average("LENGTH(lastname)")&.to_f&.round(2) || 0
    }
  end

  def calculate_percentage(part, whole)
    return 0 if whole.zero?
    ((part.to_f / whole) * 100).round(2)
  end
end