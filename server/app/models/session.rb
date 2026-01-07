class Session
  attr_reader :id, :user_id, :data, :expires_at
  
  def initialize(id:, user_id:, data: {}, expires_at: nil)
    @id = id
    @user_id = user_id
    @data = data
    @expires_at = expires_at || 2.weeks.from_now
  end

  def save
    redis_key = "session:#{@id}"
    session_data = {
      id: @id,
      user_id: @user_id,
      data: @data,
      created_at: Time.current.to_i,
      expires_at: @expires_at.to_i
    }
    
    $redis.setex(redis_key, ttl, session_data.to_json)
    $redis.sadd("user_sessions:#{@user_id}", @id)
    
    true
  end
  
  def destroy
    $redis.del("session:#{@id}")
    $redis.srem("user_sessions:#{@user_id}", @id)
  end
  
  def update(data)
    @data.merge!(data)
    save
  end
  
  def expired?
    Time.current > @expires_at
  end
  
  def renew(duration = 2.weeks)
    @expires_at = duration.from_now
    save
  end

  def to_client
    {
      session_id: @id,
      expires_at: @expires_at,
      user_data: @data.slice(:login, :firstname, :lastname) # только нужные данные
    }
  end

  def self.find(session_id)
    data = $redis.get("session:#{session_id}")
    return nil unless data
    
    session_hash = JSON.parse(data, symbolize_names: true)
    new(
      id: session_hash[:id],
      user_id: session_hash[:user_id],
      data: session_hash[:data] || {},
      expires_at: Time.at(session_hash[:expires_at])
      )
  end
    
    # Создать новую сессию для пользователя
  def self.create_for_user(user, session_data = {})
    session_id = SecureRandom.urlsafe_base64(32)
    
    new(
      id: session_id,
      user_id: user.id,
      data: {
        login: user.login,
        firstname: user.firstname,
        lastname: user.lastname,
        user_agent: session_data[:user_agent],
        ip_address: session_data[:ip_address]
      }.merge(session_data[:custom] || {})
    )
  end
  
  # Найти все сессии пользователя
  def self.find_by_user(user_id)
    session_ids = $redis.smembers("user_sessions:#{user_id}")
    
    session_ids.map do |session_id|
      find(session_id)
    end.compact
  end
  
  # Удалить все сессии пользователя
  def self.destroy_all_for_user(user_id)
    session_ids = $redis.smembers("user_sessions:#{user_id}")
    
    session_ids.each do |session_id|
      $redis.del("session:#{session_id}")
    end
    
    $redis.del("user_sessions:#{user_id}")
  end
  
  # Очистить просроченные сессии
  def self.cleanup_expired
    pattern = "session:*"
    
    $redis.scan_each(match: pattern) do |key|
      data = $redis.get(key)
      next unless data
      
      session_hash = JSON.parse(data, symbolize_names: true)
      if Time.at(session_hash[:expires_at]) < Time.current
        session_id = key.split(':').last
        user_id = session_hash[:user_id]
        
        $redis.del(key)
        $redis.srem("user_sessions:#{user_id}", session_id)
      end
    end
  end
    
   private
    
    def redis
      $redis ||= Redis.new
    end
    
    def ttl
      (@expires_at - Time.current).to_i
    end

end