require 'swagger_helper'

describe 'Admin User API', type: :request do
  path '/api/v1/admin/profile' do
    get 'Получить список пользователей' do
      tags 'Admin User'
      security [bearerAuth: []]
      parameter name: :page_size, in: :query, type: :integer, description: 'Размер страницы', default: 50
      parameter name: :page, in: :query, type: :integer, description: 'Номер страницы', default: 1
      parameter name: :role, in: :query, type: :string, description: 'Роль пользователя'
      parameter name: :search, in: :query, type: :string, description: 'Поисковый запрос'
      parameter name: :sorted_fields, in: :query, type: :string, description: 'Поля сортировки'

      response '200', 'список пользователей' do
        schema type: :object,
               properties: {
                 profiles: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       id: { type: :integer },
                       login: { type: :string },
                       phone: { type: :string },
                       firstname: { type: :string },
                       lastname: { type: :string },
                       patronymic: { type: :string },
                       role: { type: :string },
                       created_at: { type: :string, format: 'date-time' },
                       updated_at: { type: :string, format: 'date-time' }
                     }
                   }
                 },
                 pagination: {
                   type: :object,
                   properties: {
                     total_count: { type: :integer },
                     total_pages: { type: :integer },
                     current_page: { type: :integer },
                     page_size: { type: :integer }
                   }
                 }
               }
        it 'returns success' do
          # Здесь можно добавить тестовую логику
        end
      end

      response '401', 'не авторизован' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end

      response '403', 'недостаточно прав' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end
    end

    post 'Добавить пользователя' do
      tags 'Admin User'
      security [bearerAuth: []]
      consumes 'application/json'
      produces 'application/json'
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          login: { type: :string },
          phone: { type: :string },
          firstname: { type: :string },
          lastname: { type: :string },
          patronymic: { type: :string },
          role: { type: :string },
          password: { type: :string }
        },
        required: ['login', 'phone', 'firstname', 'lastname', 'role', 'password']
      }

      response '200', 'пользователь добавлен' do
        schema type: :object,
               properties: {
                 profile: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     login: { type: :string },
                     phone: { type: :string },
                     firstname: { type: :string },
                     lastname: { type: :string },
                     patronymic: { type: :string },
                     role: { type: :string },
                     created_at: { type: :string, format: 'date-time' },
                     updated_at: { type: :string, format: 'date-time' }
                   }
                 }
               }
        it 'returns success' do
          # Здесь можно добавить тестовую логику
        end
      end

      response '422', 'ошибка валидации' do
        schema type: :object,
               properties: {
                 errors: {
                   type: :object,
                   properties: {
                     field: { type: :array, items: { type: :string } }
                   }
                 }
               }
      end

      response '401', 'не авторизован' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end

      response '403', 'недостаточно прав' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end
    end
  end

  path '/api/v1/admin/profile/{user_id}' do
    parameter name: :user_id, in: :path, type: :integer, required: true, description: 'ID пользователя'

    get 'Получить информацию о пользователе' do
      tags 'Admin User'
      security [bearerAuth: []]

      response '200', 'информация о пользователе' do
        schema type: :object,
               properties: {
                 profile: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     login: { type: :string },
                     phone: { type: :string },
                     firstname: { type: :string },
                     lastname: { type: :string },
                     patronymic: { type: :string },
                     role: { type: :string },
                     created_at: { type: :string, format: 'date-time' },
                     updated_at: { type: :string, format: 'date-time' }
                   }
                 }
               }
        it 'returns success' do
          # Здесь можно добавить тестовую логику
        end
      end

      response '404', 'пользователь не найден' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end

      response '401', 'не авторизован' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end

      response '403', 'недостаточно прав' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end
    end

    put 'Обновить пользователя' do
      tags 'Admin User'
      security [bearerAuth: []]
      consumes 'application/json'
      produces 'application/json'
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          login: { type: :string },
          phone: { type: :string },
          firstname: { type: :string },
          lastname: { type: :string },
          patronymic: { type: :string },
          role: { type: :string }
        }
      }

      response '200', 'пользователь обновлен' do
        schema type: :object,
               properties: {
                 profile: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     login: { type: :string },
                     phone: { type: :string },
                     firstname: { type: :string },
                     lastname: { type: :string },
                     patronymic: { type: :string },
                     role: { type: :string },
                     created_at: { type: :string, format: 'date-time' },
                     updated_at: { type: :string, format: 'date-time' }
                   }
                 }
               }
        it 'returns success' do
          # Здесь можно добавить тестовую логику
        end
      end

      response '422', 'ошибка валидации' do
        schema type: :object,
               properties: {
                 errors: {
                   type: :object,
                   properties: {
                     field: { type: :array, items: { type: :string } }
                   }
                 }
               }
      end

      response '404', 'пользователь не найден' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end

      response '401', 'не авторизован' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end

      response '403', 'недостаточно прав' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end
    end

    delete 'Удалить пользователя' do
      tags 'Admin User'
      security [bearerAuth: []]

      response '200', 'пользователь удален' do
        schema type: :object,
               properties: {
                 message: { type: :string }
               }
        it 'returns success' do
          # Здесь можно добавить тестовую логику
        end
      end

      response '404', 'пользователь не найден' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end

      response '401', 'не авторизован' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end

      response '403', 'недостаточно прав' do
        schema type: :object,
               properties: {
                 error: { type: :string }
               }
      end
    end
  end
end
