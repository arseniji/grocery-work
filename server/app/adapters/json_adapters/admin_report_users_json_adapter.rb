class AdminReportUsersJsonAdapter < BaseJsonAdapter
  def initialize(collection: , metadata: {})
    @collection = collection
    @metadata = metadata
    super(collection)
  end

  def as_json(**options)
    {
      success: true,
      report_type: 'users',
      generated_at: Time.current.iso8601,
      data: {
        summary: summary_section,
        roles: roles_section,
        registrations: registrations_section,
        authentication: authentication_section,
        statistics: statistics_section,
      },
      meta: {
        metadata: @metadata.merge(options[:metadata] || {})
      }
    }
  end

  private

  def summary_section
    {
      total_users: @collection[:total_users],
      users_with_orders: @collection.dig(:users_with_orders_stats, :users_with_orders),
      users_without_orders: @collection.dig(:users_with_orders_stats, :users_without_orders),
      engagement_rate: "#{@collection.dig(:users_with_orders_stats, :percentage_with_orders)}%"
    }
  end

  def roles_section
    {
      distribution: @collection[:users_by_role],
      percentages: @collection[:role_distribution_percentage]&.transform_values { |v| "#{v}%" }
    }
  end

  def registrations_section
    {
      last_24_hours: @collection.dig(:recent_registrations, :last_24_hours),
      last_7_days: @collection.dig(:recent_registrations, :last_7_days),
      last_30_days: @collection.dig(:recent_registrations, :last_30_days)
    }
  end

  def authentication_section
    {
      login_stats: @collection[:login_statistics],
    }
  end

  def statistics_section
    {
      phones: @collection[:phone_statistics],
    }
  end
end