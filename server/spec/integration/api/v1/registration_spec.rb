require 'swagger_helper'

describe 'Registration API', type: :request do
  path '/api/v1/register' do
    post 'Регистрация пользователя' do
      tags 'Registration'
      consumes 'application/json'
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          login: { type: :string },
          phone: { type: :string },
          role: { type: :string },
          password: { type: :string },
          firstname: { type: :string },
          lastname: { type: :string },
          patronymic: { type: :string }
        },
        required: ['login', 'phone', 'role', 'password', 'firstname', 'lastname']
      }

      response '200', 'успешно зарегистрирован' do
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

      response '422', 'ошибка валидации' do
        schema type: :object,
               properties: {
                 errors: { type: :array, items: { type: :string } }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end
    end
  end
end
