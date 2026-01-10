Rails.application.routes.draw do
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
        get '/', to: 'order#get_user_orders'
      end
    end
  end
end
