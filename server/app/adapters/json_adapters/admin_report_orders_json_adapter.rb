class AdminReportOrdersJsonAdapter < BaseJsonAdapter
  def initialize(report_data, metadata: {})
    @report_data = report_data
    @metadata = metadata
    super(report_data)
  end

  def as_json(**options)
    metadata = @metadata.merge(options[:metadata] || {})

    {
      success: true,
      report_type: 'orders',
      generated_at: Time.current.iso8601,
      data: {
        summary: summary_section,
        statuses: statuses_section,
        recent_activity: recent_activity_section,
        items_statistics: items_statistics_section,
        processing: processing_section,
        user_engagement: user_engagement_section,
        date_ranges: date_ranges_section
      },
      meta: {
        total_orders: @report_data[:total_orders],
        metadata: metadata
      }
    }
  end

  private

  def summary_section
    {
      total_orders: @report_data[:total_orders],
      completion_rate: "#{@report_data.dig(:orders_with_items_stats, :percentage_with_items)}%"
    }
  end

  def statuses_section
    {
      distribution: @report_data[:orders_by_status],
      percentages: @report_data[:status_distribution_percentage]&.transform_values { |v| "#{v}%" }
    }
  end

  def recent_activity_section
    {
      last_24_hours: @report_data.dig(:recent_orders, :last_24_hours),
      last_7_days: @report_data.dig(:recent_orders, :last_7_days),
      last_30_days: @report_data.dig(:recent_orders, :last_30_days)
    }
  end
  def items_statistics_section
    {
      average_items_per_order: @report_data[:average_items_per_order],
      average_products_per_order: @report_data[:average_products_per_order]
    }
  end

  def processing_section
    @report_data[:processing_time_stats]
  end

  def user_engagement_section
    @report_data[:user_engagement]
  end

  def date_ranges_section
    {
      created_at: format_date_range(@report_data[:created_at_range]),
      updated_at: format_date_range(@report_data[:updated_at_range])
    }
  end

  def format_date_range(range)
    return {} unless range

    {
      earliest: range[:earliest]&.iso8601(0),
      latest: range[:latest]&.iso8601(0)
    }
  end
end