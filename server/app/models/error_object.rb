class ErrorObject
  attr_reader :message, :code, :details
  
  def initialize(message:, code:, details: {})
    @message = message
    @code = code
    @details = details
  end
end