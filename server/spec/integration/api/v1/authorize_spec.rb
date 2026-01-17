require 'swagger_helper'

describe 'Authorization API', type: :request do
  path '/api/v1/login' do
    post 'Авторизация пользователя' do
      tags 'Authorization'
      consumes 'application/json'
      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          login: { type: :string },
          password: { type: :string }
        },
        required: ['login', 'password']
      }

      response '200', 'успешно авторизован' do
        schema type: :object,
               properties: {
                 user: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     login: { type: :string },
                     role: { type: :string }
                   }
                 },
                 session: {
                   type: :object,
                   properties: {
                     token: { type: :string }
                   }
                 }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end

      response '401', 'неверные credentials' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end
    end
  end
end
