Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs' if Rails.env.development?
  mount Rswag::Api::Engine => '/api-docs' if Rails.env.development?

  namespace :api do
    namespace :v1 do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
  
      post 'register', to: 'registration#registration'
      post 'login', to: 'authorize#authorizate'
      delete 'logout', to: 'base#logout'
      get 'session_expire', to: 'base#check_expire_session'
      scope :products do
        get 'categories', to: 'get_product#get_all_category'
        get 'top', to: 'get_product#get_top_products'
        get ':id', to: 'get_product#get_product_details'
        get '/', to: 'get_product#get_product_page'
      end
      scope :cart do
        post 'add', to: 'cart#add_product_to_cart'
        post 'add-one/:product_id', to: 'cart#add_quantity_product_on_cart'
        delete 'remove/:product_id', to: 'cart#delete_product_on_cart'
        delete 'remove-one/:product_id', to: 'cart#delete_quantity_product_on_cart'
        delete 'clear', to: 'cart#clear_products_to_cart'
        get '/', to: 'cart#get_cart'  # Добавить метод в контроллер
      end
      scope :order do
        post 'create', to: 'order#create_order'
        get 'status_collection', to: 'order#get_all_status_orders'
        get '/', to: 'order#get_user_orders'
        get ':order_id', to: 'order#get_order_detail_user'
        delete 'cancellation/:order_id', to: 'order#cancellation_orders'
      end
      scope :profile do
        get 'me', to: 'profile#get_me'
        patch 'me', to: 'profile#update_me'
        delete 'me', to: 'profile#delete_me_profile'
      end
      scope :admin do
        scope :product do
              get '/', to: "admin_product#get_products" 
              get ':id', to: "admin_product#get_product_details" 
              post '/', to: "admin_product#add_product" 
              put ':id', to: "admin_product#update_product"
              delete ':id', to: "admin_product#delete_product" 
        end
        scope :profile do
          get '/', to: "admin_profile#get_profiles"
          get ':user_id', to: "admin_profile#get_profile_info"
          post '/', to: "admin_profile#add_profile"
          put ':user_id', to: "admin_profile#update_profile"
          delete ':user_id', to: "admin_profile#delete_profile"
        end
        scope :order do
          get '/', to: "admin_order#get_all_orders_user"
          get 'user/:user_id/order/:order_id', to: "admin_order#get_order_detail_user"
          put 'user/:user_id/order/:order_id', to: "admin_order#update_orders"
          post 'user/:user_id/order/:order_id/product/:product_id', to: "admin_order#add_product_orders_items"
          delete 'user/:user_id/order/:order_id/product/:product_id', to: "admin_order#delete_product_order_items"
        end
        scope :data do
          post 'import/:entity', to: "admin_data#import"
          get 'export/:entity', to: "admin_data#export"
        end
        scope :command do
          post 'undo', to: "command#undo"
          post 'redo', to: "command#redo"
          get 'history', to: "command#history"
          delete 'history', to: "command#clear_history"
        end
      end
    end
  end
end
