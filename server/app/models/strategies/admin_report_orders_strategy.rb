require_relative 'admin_report_strategy'

class AdminReportOrdersStrategy < AdminReportStrategy
  def gather_report_data
    {
      total_orders: total_orders_count,
      orders_by_status: orders_count_by_status,
      status_distribution_percentage: status_distribution_percentage,
      recent_orders: recent_orders_stats,
      orders_with_items: orders_with_items_stats,
      revenue_statistics: revenue_statistics,
      created_at_range: created_at_date_range,
      updated_at_range: updated_at_date_range,
      average_items_per_order: average_items_per_order,
      user_engagement: user_engagement_stats
    }
  end

  private

  def total_orders_count
    Order.count
  end

  def orders_count_by_status
    Order.group(:status).count
  end

  def status_distribution_percentage
    total = Order.count.to_f
    return {} if total.zero?

    Order.group(:status).count.transform_values do |count|
      calculate_percentage(count, total)
    end
  end

  def recent_orders_stats
    {
      last_24_hours: Order.where('created_at >= ?', 24.hours.ago).count,
      last_7_days: Order.where('created_at >= ?', 7.days.ago).count,
      last_30_days: Order.where('created_at >= ?', 30.days.ago).count
    }
  end

  def orders_with_items_stats
    {
      orders_with_items: Order.joins(:order_items).distinct.count,
      orders_without_items: Order.left_joins(:order_items).where(order_items: { id: nil }).count,
      percentage_with_items: calculate_percentage(
        Order.joins(:order_items).distinct.count,
        Order.count
      )
    }
  end

  def revenue_statistics
    # Вычисляем выручку через order_items и products
    total_revenue = OrderItem.joins(:product)
                             .sum('order_items.quantity * products.price')
                             .to_f
                             .round(2)

    # Получаем статистику по заказам с товарами
    orders_with_items = Order.joins(:order_items)
                             .select('orders.id, SUM(order_items.quantity * products.price) as order_total')
                             .joins('INNER JOIN products ON products.id = order_items.product_id')
                             .group('orders.id')

    order_totals = orders_with_items.map(&:order_total).compact

    {
      total_revenue: total_revenue,
      average_order_value: order_totals.any? ? (order_totals.sum / order_totals.size.to_f).round(2) : 0,
      min_order_value: order_totals.any? ? order_totals.min.to_f.round(2) : 0,
      max_order_value: order_totals.any? ? order_totals.max.to_f.round(2) : 0,
      orders_with_price: order_totals.size,
    }
  end

  def created_at_date_range
    {
      earliest: Order.minimum(:created_at),
      latest: Order.maximum(:created_at)
    }
  end

  def updated_at_date_range
    {
      earliest: Order.minimum(:updated_at),
      latest: Order.maximum(:updated_at)
    }
  end

  def average_items_per_order
    total_items = OrderItem.count
    total_orders = Order.count

    return 0 if total_orders.zero?

    (total_items.to_f / total_orders).round(2)
  end

  def user_engagement_stats
    total_users = User.count
    users_with_orders = Order.distinct.count(:user_id)

    {
      total_users: total_users,
      users_with_orders: users_with_orders,
      users_without_orders: total_users - users_with_orders,
      engagement_percentage: calculate_percentage(users_with_orders, total_users)
    }
  end

  def default_processing_stats
    {
      average_hours: 0,
      min_hours: 0,
      max_hours: 0
    }
  end

  def calculate_percentage(part, whole)
    return 0 if whole.zero?
    ((part.to_f / whole) * 100).round(2)
  end
end