class BaseSession
  class SessionError < StandardError; end
  class SessionNotFoundError < SessionError; end
  class SessionExpiredError < SessionError; end

  attr_reader :id, :user_id, :data, :expires_at

  def initialize(id:, user_id:, data: {}, expires_at: nil)
    @id = id
    @user_id = user_id
    @data = data
    @expires_at = expires_at || default_duration.from_now
    validate!
  end

  def save
    raise NotImplementedError, "#{self.class} должен реализовать метод #save"
  end

  def destroy
    raise NotImplementedError, "#{self.class} должен реализовать метод #destroy"
  end

  def self.find(session_id)
    raise NotImplementedError, "#{self} должен реализовать метод .find"
  end

  def self.create_for_user(user, session_data = {})
    raise NotImplementedError, "#{self} должен реализовать метод .create_for_user"
  end

  def self.find_by_user(user_id)
    raise NotImplementedError, "#{self} должен реализовать метод .find_by_user"
  end

  def self.destroy_all_for_user(user_id)
    raise NotImplementedError, "#{self} должен реализовать метод .destroy_all_for_user"
  end

  def update(data)
    @data.merge!(data)
    save
  end

  def expired?
    Time.current > @expires_at
  end

  def renew(duration = default_duration)
    @expires_at = duration.from_now
    save
  end

  def to_client
    {
      session_id: @id,
      expires_at: @expires_at,
      user_data: extract_user_data
    }
  end

  def valid?
    !expired? && validate_data
  end

  def touch
    renew((@expires_at - Time.current).seconds) if valid?
  end

  protected

  def validate!
    raise SessionError, "Session ID не может быть пустым" if @id.nil? || @id.to_s.empty?
    raise SessionError, "User ID не может быть пустым" if @user_id.nil?
    raise SessionExpiredError, "Сессия истекла" if expired?
  end

  def validate_data
    @data.is_a?(Hash)
  end

  def extract_user_data
    @data.slice(:login, :firstname, :lastname)
  end

  def default_duration
    2.weeks
  end

  def generate_session_id
    SecureRandom.urlsafe_base64(32)
  end

  def ttl
    (@expires_at - Time.current).to_i
  end

  private

  def sanitize_data(data)
    data.is_a?(Hash) ? data : {}
  end
end