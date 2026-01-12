require 'swagger_helper'

describe 'Profile API', type: :request do
  path '/api/v1/profile/me' do
    get 'Получить профиль пользователя' do
      tags 'Profile'
      security [bearerAuth: []]

      response '200', 'успешно' do
        schema type: :object,
               properties: {
                 user: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     login: { type: :string },
                     phone: { type: :string },
                     firstname: { type: :string },
                     lastname: { type: :string },
                     patronymic: { type: :string },
                     role: { type: :string }
                   }
                 }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end
    end

    patch 'Обновить профиль пользователя' do
      tags 'Profile'
      security [bearerAuth: []]
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          login: { type: :string },
          phone: { type: :string },
          firstname: { type: :string },
          lastname: { type: :string },
          patronymic: { type: :string }
        }
      }

      response '200', 'успешно обновлен' do
        schema type: :object,
               properties: {
                 user: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     login: { type: :string }
                   }
                 }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end
    end

    delete 'Удалить профиль пользователя' do
      tags 'Profile'
      security [bearerAuth: []]

      response '200', 'успешно удален' do
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
end
