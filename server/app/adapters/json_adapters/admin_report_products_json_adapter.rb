class AdminReportProductsJsonAdapter < BaseJsonAdapter
  def initialize(report_data, metadata: {})
    @report_data = report_data
    @metadata = metadata
    super(report_data)
  end

  def as_json(**options)
    metadata = @metadata.merge(options[:metadata] || {})

    {
      success: true,
      report_type: 'products',
      generated_at: Time.current.iso8601,
      data: {
        summary: summary_section,
        categories: categories_section,
        pricing: pricing_section,
        ratings: ratings_section,
        inventory: inventory_section,
        top_products: top_products_section,
        stock_alerts: stock_alerts_section,
        sales_performance: sales_performance_section,
        measurement_units: measurement_units_section,
        category_details: category_details_section,
        date_ranges: date_ranges_section
      },
      meta: {
        total_products: @report_data[:total_products],
        metadata: metadata
      }
    }
  end

  private

  def summary_section
    {
      total_products: @report_data[:total_products],
      out_of_stock: @report_data[:out_of_stock_products],
      products_without_orders: @report_data[:products_without_orders],
      total_inventory_value: @report_data.dig(:price_statistics, :total_inventory_value),
      average_product_name_length: @report_data[:average_product_name_length]
    }
  end

  def categories_section
    {
      distribution: @report_data[:products_by_category],
      percentages: @report_data[:category_distribution_percentage]&.transform_values { |v| "#{v}%" }
    }
  end

  def pricing_section
    {
      statistics: @report_data[:price_statistics].except(:price_by_category),
      by_category: @report_data.dig(:price_statistics, :price_by_category),
      price_ranges: @report_data[:price_ranges]
    }
  end

  def ratings_section
    @report_data[:rating_statistics]
  end

  def inventory_section
    @report_data[:quantity_statistics]
  end

  def top_products_section
    {
      by_rating: @report_data[:top_rated_products],
      by_orders: @report_data[:most_ordered_products],
      by_revenue: @report_data[:revenue_by_product]
    }
  end

  def stock_alerts_section
    {
      low_stock_count: @report_data[:low_stock_products]&.size || 0,
      low_stock_products: @report_data[:low_stock_products],
      out_of_stock_count: @report_data[:out_of_stock_products]
    }
  end

  def sales_performance_section
    {
      most_ordered: @report_data[:most_ordered_products],
      products_without_orders: @report_data[:products_without_orders]
    }
  end

  def measurement_units_section
    @report_data[:measurement_units_distribution]
  end

  def category_details_section
    @report_data[:category_statistics]
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
      earliest: range[:earliest]&.iso8601,
      latest: range[:latest]&.iso8601
    }
  end
end