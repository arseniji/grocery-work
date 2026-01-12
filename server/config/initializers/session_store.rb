Rails.application.config.session_store :redis_store,
  servers: {
    url: ENV['REDIS_URL'] || 'redis://localhost:6379/0',
    namespace: 'shop:sessions',
    expire_after: 2.weeks
  },
  expires_in: 2.weeks,
  key: '_shop_session'