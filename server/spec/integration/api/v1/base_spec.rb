require 'swagger_helper'

describe 'Base API', type: :request do
  path '/api/v1/logout' do
    delete 'Выход из системы' do
      tags 'Base'
      security [bearerAuth: []]

      response '200', 'успешно вышел' do
        schema type: :object,
               properties: {
                 message: { type: :string }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end
    end
  end

  path '/api/v1/session_expire' do
    get 'Проверка истечения сессии' do
      tags 'Base'
      security [bearerAuth: []]

      response '200', 'статус сессии' do
        schema type: :object,
               properties: {
                 expired: { type: :boolean },
                 timestamp: { type: :string, format: 'date-time' }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end
    end
  end
end
