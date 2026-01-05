require 'jsonapi/serializer'

JSONAPI::Rails.configure do |config|
  config.default_except = [:created_at, :updated_at]
end