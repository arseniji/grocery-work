require_relative 'admin_report_strategy'

class AdminReportProductsStrategy < AdminReportStrategy
  def gather_report_data(report_obj)
    super(report_obj)
    report_obj.add_metric(:total_products, total_products_count)
    report_obj.add_metric(:products_by_category, products_count_by_category)
    report_obj.add_metric(:category_distribution_percentage, category_distribution_percentage)
    report_obj.add_metric(:price_statistics, price_statistics)
    report_obj.add_metric(:rating_statistics, rating_statistics)
    report_obj.add_metric(:quantity_statistics, quantity_statistics)
    report_obj.add_metric(:top_rated_products, top_rated_products)
    report_obj.add_metric(:low_stock_products, low_stock_products)
    report_obj.add_metric(:out_of_stock_products, out_of_stock_products)
    report_obj.add_metric(:most_ordered_products, most_ordered_products)
    report_obj.add_metric(:products_without_orders, products_without_orders_count)
    report_obj.add_metric(:measurement_units_distribution, measurement_units_distribution)
    report_obj.add_metric(:revenue_by_product, revenue_by_product)
    report_obj.add_metric(:price_ranges, price_ranges_distribution)
    report_obj.add_metric(:created_at_range, created_at_date_range)
    report_obj.add_metric(:updated_at_range, updated_at_date_range)
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
      price_by_category: price_by_category
    }
  end

  def calculate_total_inventory_value
    Product.sum('price * quantity').to_f.round(2)
  end

  def price_by_category
    Product.group(:category)
           .select('category, AVG(price) as avg_price, MIN(price) as min_price, MAX(price) as max_price')
           .map do |result|
      [
        result.category,
        {
          average: result.avg_price.to_f.round(2),
          min: result.min_price.to_f.round(2),
          max: result.max_price.to_f.round(2)
        }
      ]
    end.to_h
  end

  def rating_statistics
    products_with_rating = Product.where.not(rating: nil)

    return default_rating_stats if products_with_rating.empty?

    {
      products_with_rating: products_with_rating.count,
      products_without_rating: Product.where(rating: nil).count,
      average_rating: products_with_rating.average(:rating)&.to_f&.round(2) || 0,
      min_rating: products_with_rating.minimum(:rating)&.to_f&.round(2) || 0,
      max_rating: products_with_rating.maximum(:rating)&.to_f&.round(2) || 0,
      rating_distribution: rating_distribution
    }
  end

  def default_rating_stats
    {
      products_with_rating: 0,
      products_without_rating: Product.count,
      average_rating: 0,
      min_rating: 0,
      max_rating: 0,
      rating_distribution: {}
    }
  end

  def rating_distribution
    {
      excellent: Product.where('rating >= ?', 4.5).count,
      good: Product.where('rating >= ? AND rating < ?', 3.5, 4.5).count,
      average: Product.where('rating >= ? AND rating < ?', 2.5, 3.5).count,
      poor: Product.where('rating < ?', 2.5).where.not(rating: nil).count
    }
  end

  def quantity_statistics
    {
      total_items_in_stock: Product.sum(:quantity),
      average_quantity: Product.average(:quantity)&.to_f&.round(2) || 0,
      min_quantity: Product.minimum(:quantity) || 0,
      max_quantity: Product.maximum(:quantity) || 0,
      quantity_by_category: quantity_by_category
    }
  end

  def quantity_by_category
    Product.group(:category)
           .sum(:quantity)
  end

  def top_rated_products
    Product.where.not(rating: nil)
           .order(rating: :desc)
           .limit(10)
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

  def low_stock_products
    Product.where('quantity > 0 AND quantity <= ?', 10)
           .order(:quantity)
           .limit(20)
           .map do |product|
      {
        id: product.id,
        name: product.product_name,
        category: product.category,
        quantity: product.quantity,
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
           .limit(10)
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

  def products_without_orders_count
    Product.left_joins(:order_items)
           .where(order_items: { id: nil })
           .count
  end

  def measurement_units_distribution
    Product.group(:measurement_unit).count
  end

  def revenue_by_product
    Product.joins(:order_items)
           .group('products.id', 'products.product_name')
           .select('products.id, products.product_name,
                    SUM(order_items.quantity * products.price) as revenue')
           .order('revenue DESC')
           .limit(10)
           .map do |result|
      {
        id: result.id,
        name: result.product_name,
        revenue: result.revenue.to_f.round(2)
      }
    end
  end

  def price_ranges_distribution
    {
      budget: Product.where('price < ?', 50).count,
      mid_range: Product.where('price >= ? AND price < ?', 50, 200).count,
      premium: Product.where('price >= ? AND price < ?', 200, 500).count,
      luxury: Product.where('price >= ?', 500).count
    }
  end

  def created_at_date_range
    {
      earliest: Product.minimum(:created_at),
      latest: Product.maximum(:created_at)
    }
  end

  def updated_at_date_range
    {
      earliest: Product.minimum(:updated_at),
      latest: Product.maximum(:updated_at)
    }
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