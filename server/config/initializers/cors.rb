Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:5173', 
            'http://127.0.0.1:5173',
            'http://195.19.64.155:5173',  # ДОБАВЬТЕ
            'http://localhost:4000',
            'http://195.19.64.155:4000'
            
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization', 'Total', 'Per-Page'],
      credentials: true,
      max_age: 600
  end
end