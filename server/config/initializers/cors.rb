Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3001', 'http://localhost:3000', 'http://127.0.0.1:3001'
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization', 'Total', 'Per-Page'],
      credentials: true,
      max_age: 600
  end
end