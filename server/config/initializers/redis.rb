$redis = Redis.new(url: ENV['REDIS_URL'] || 'redis://localhost:6379/0')

# Проверяем подключение
begin
  $redis.ping
  Rails.logger.info "Redis connected successfully"
rescue => e
  Rails.logger.error "Redis connection failed: #{e.message}"
end

# Кастомное хранилище сессий в Redis
Rails.application.config.session_store :redis_store,
  redis_server: {
    url: ENV['REDIS_URL'] || 'redis://localhost:6379/0',
    namespace: 'shop:sessions',
    expire_after: 2.weeks
  },
  expires_in: 2.weeks,
  key: '_shop_session'