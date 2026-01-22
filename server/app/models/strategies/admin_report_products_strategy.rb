require_relative 'admin_report_strategy'

class AdminReportProductsStrategy < AdminReportStrategy
  def gather_report_data(report_obj)
    super(report_obj)
    report_obj.add_metric(:total_products, total_products_count)
    report_obj.add_metric(:products_by_category, products_count_by_category)
    report_obj.add_metric(:category_distribution_percentage, category_distribution_percentage)
    report_obj.add_metric(:price_statistics, price_statistics)
    report_obj.add_metric(:top_rated_products, top_rated_products)
    report_obj.add_metric(:out_of_stock_products, out_of_stock_products)
    report_obj.add_metric(:most_ordered_products, most_ordered_products)
    report_obj.add_metric(:category_statistics, category_statistics)
  end

  private

  def total_products_count
    Product.count
  end

  def products_count_by_category
    Product.group(:category).count
  end

  def category_distribution_percentage
    total = Product.count.to_f
    return {} if total.zero?

    Product.group(:category).count.transform_values do |count|
      calculate_percentage(count, total)
    end
  end

  def price_statistics
    {
      average_price: Product.average(:price)&.to_f&.round(2) || 0,
      min_price: Product.minimum(:price)&.to_f&.round(2) || 0,
      max_price: Product.maximum(:price)&.to_f&.round(2) || 0,
      total_inventory_value: calculate_total_inventory_value,
    }
  end

  def calculate_total_inventory_value
    Product.sum('price * quantity').to_f.round(2)
  end


  def quantity_by_category
    Product.group(:category)
           .sum(:quantity)
  end

  def top_rated_products
    Product.where.not(rating: nil)
           .order(rating: :desc)
           .limit(5)
           .map do |product|
      {
        id: product.id,
        name: product.product_name,
        category: product.category,
        rating: product.rating.to_f.round(2),
        price: product.price.to_f.round(2)
      }
    end
  end
  def out_of_stock_products
    Product.where(quantity: 0).count
  end

  def most_ordered_products
    Product.joins(:order_items)
           .group('products.id', 'products.product_name', 'products.category', 'products.price')
           .select('products.id, products.product_name, products.category, products.price,
                    COUNT(order_items.id) as orders_count,
                    SUM(order_items.quantity) as total_sold,
                    SUM(order_items.quantity * products.price) as total_revenue')
           .order('orders_count DESC')
           .limit(5)
           .map do |result|
      {
        id: result.id,
        name: result.product_name,
        category: result.category,
        price: result.price.to_f.round(2),
        orders_count: result.orders_count,
        total_sold: result.total_sold,
        total_revenue: result.total_revenue.to_f.round(2)
      }
    end
  end
  def category_statistics
    Product.group(:category)
           .select('category,
                    COUNT(*) as products_count,
                    AVG(price) as avg_price,
                    SUM(quantity) as total_quantity,
                    AVG(rating) as avg_rating')
           .map do |result|
      [
        result.category,
        {
          products_count: result.products_count,
          average_price: result.avg_price.to_f.round(2),
          total_quantity: result.total_quantity,
          average_rating: result.avg_rating&.to_f&.round(2) || 0
        }
      ]
    end.to_h
  end

  def calculate_percentage(part, whole)
    return 0 if whole.zero?
    ((part.to_f / whole) * 100).round(2)
  end
end