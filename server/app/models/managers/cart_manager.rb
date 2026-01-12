class CartManager
  extend CustomObservable
  add_observer(SessionManager)


    def self.add_product_to_cart(product_id, quantity, session_id)
      self.with_product_and_cart(product_id, session_id) do |product, cart|
        cart.add_product(product, quantity: quantity)
        self.update_and_respond(session_id, cart)
      end
    end

    def self.add_quantity_product_on_cart(product_id, session_id)
      self.with_product_and_cart(product_id, session_id) do |product, cart|
        cart.add_quantity_product(product)
        self.update_and_respond(session_id, cart)
      end
    end

    def self.get_cart(session_id)
      cart, products = self.get_cart_products(session_id)
      self.adapt_cart_collection(cart, products)
    end


    def self.delete_product_on_cart(product_id, session_id)
      self.with_product_and_cart(product_id, session_id) do |product, cart|
        cart.delete_product(product)
        self.update_and_respond(session_id, cart)
      end
    end

    def self.delete_quantity_product_on_cart(product_id, session_id)
      self.with_product_and_cart(product_id, session_id) do |product, cart|
        cart.delete_quantity_product(product)
        self.update_and_respond(session_id, cart)
      end
    end

    def self.clear_products_to_cart(session_id)
      notify_observers(:clear_cart_user, session_id)
      self.success_response
    end

    def self.get_cart_info(session_id)
      cart, products = self.get_cart_products(session_id)
      total_price = self.calculate_total_price(cart, products),
      total_items = cart.total_items
      return [cart, products, total_price, total_items]
    end

    private_class_method

    def self.extract_cart(cart_result)
      cart_result.each do |observer, result|
        if observer.is_a?(SessionManager) || observer == SessionManager
          cart = result
          return cart
        end
      end
      return Cart.new()
    end

    def self.with_product_and_cart(product_id, session_id)
      product = self.find_product(product_id)
      return product if product.is_a?(Hash)

      cart_result = self.get_user_cart(session_id)
      cart = self.extract_cart(cart_result)

      begin
        yield(product, cart)
      rescue Cart::SizeCartError => e
        self.stock_error_response(e, product_id)
      end
    end

    def self.find_product(product_id)
      product = Product.find_by(id: product_id)
      return product if product

      error = ErrorObject.new(
        message: "Такого продукта не существует", 
        code: :not_found,
        details: { product_id: product_id }
      )
      self.adapt_error(error)
    end

    def self.get_user_cart(session_id)
      notify_observers(:get_cart_user, session_id)
    end

    def self.update_and_respond(session_id, cart)
      notify_observers(:update_cart_user, session_id, cart)
      self.success_response
    end

    def self.fetch_cart_products(cart)
      return [] if cart.empty?
      product_ids = cart.product_collection.keys.map do |key|
        key.to_s.to_i
      end
      Product.where(id: product_ids)
    end

    def self.adapt_cart_collection(cart, products)
      return self.empty_cart_response if products.empty?
      quantities = cart.product_collection.transform_keys { |k| k.to_s }
      
      JsonAdapterFacade.adapt_collection(
        products,
        type: :cart,
        quantities: quantities,
        total_price: calculate_total_price(cart, products),
        total_items: cart.total_items
      )
    end

    def self.calculate_total_price(cart, products)
      product_map = products.index_by(&:id)
      cart.product_collection.sum do |product_id_key, quantity|
        product_id = product_id_key.to_s.to_i
        product = product_map[product_id]
        product ? product.price * quantity : 0
      end
    end


    def self.success_response
      JsonAdapterFacade.adapt(nil, type: :successful)
    end

    def self.stock_error_response(exception, product_id)
      error = ErrorObject.new(
        message: exception.message, 
        code: :insufficient_stock,
        details: { product_id: product_id }
      )
      self.adapt_error(error)
    end

    def self.adapt_error(error_object)
      JsonAdapterFacade.adapt(error_object, type: :error)
    end

    def self.empty_cart_response
      JsonAdapterFacade.adapt_collection(
        [],
        type: :cart,
        quantities: {},
        total_price: 0,
        total_items: 0
      )
    end

    def self.get_cart_products(session_id)
      cart_result = self.get_user_cart(session_id)
      cart = self.extract_cart(cart_result)
      products = self.fetch_cart_products(cart)
      return [cart, products]
    end
end