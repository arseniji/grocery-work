require 'swagger_helper'

describe 'Admin Order API', type: :request do
  path '/api/v1/admin/order/user/{user_id}' do
    parameter name: :user_id, in: :path, type: :integer, required: true, description: 'ID пользователя'

    get 'Получить все заказы пользователя' do
      tags 'Admin Order'
      security [bearerAuth: []]
      parameter name: :status, in: :query, type: :string, description: 'Статус заказа'
      parameter name: :page, in: :query, type: :integer, description: 'Номер страницы', default: 1
      parameter name: :page_size, in: :query, type: :integer, description: 'Размер страницы', default: 20
      parameter name: :search, in: :query, type: :string, description: 'Поисковый запрос'
      parameter name: :sort, in: :query, type: :string, description: 'Сортировка (например, created_at:desc)'

      response '200', 'список заказов' do
        schema type: :object,
               properties: {
                 orders: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       id: { type: :integer },
                       status: { type: :string },
                       description: { type: :string },
                       created_at: { type: :string, format: 'date-time' },
                       updated_at: { type: :string, format: 'date-time' },
                       user_id: { type: :integer },
                       total_price: { type: :number }
                     }
                   }
                 },
                 total_pages: { type: :integer },
                 current_page: { type: :integer }
               }
        it 'returns success' do
        end
      end

      response '401', 'не авторизован' do
        schema type: :object, properties: { error: { type: :string } }
      end

      response '403', 'недостаточно прав' do
        schema type: :object, properties: { error: { type: :string } }
      end
    end
  end

  path '/api/v1/admin/order/user/{user_id}/order/{order_id}' do
    parameter name: :user_id, in: :path, type: :integer, required: true, description: 'ID пользователя'
    parameter name: :order_id, in: :path, type: :integer, required: true, description: 'ID заказа'

    get 'Получить детали заказа пользователя' do
      tags 'Admin Order'
      security [bearerAuth: []]

      response '200', 'детали заказа' do
        schema type: :object,
               properties: {
                 order: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     status: { type: :string },
                     description: { type: :string },
                     created_at: { type: :string, format: 'date-time' },
                     updated_at: { type: :string, format: 'date-time' },
                     user_id: { type: :integer },
                     total_price: { type: :number },
                     order_items: {
                       type: :array,
                       items: {
                         type: :object,
                         properties: {
                           id: { type: :integer },
                           product_id: { type: :integer },
                           quantity: { type: :integer },
                           price: { type: :number }
                         }
                       }
                     }
                   }
                 }
               }
        it 'returns success' do
        end
      end

      response '404', 'заказ не найден' do
        schema type: :object, properties: { error: { type: :string } }
      end

      response '401', 'не авторизован' do
        schema type: :object, properties: { error: { type: :string } }
      end

      response '403', 'недостаточно прав' do
        schema type: :object, properties: { error: { type: :string } }
      end
    end

    put 'Обновить заказ пользователя' do
      tags 'Admin Order'
      security [bearerAuth: []]
      consumes 'application/json'
      parameter name: :order, in: :body, schema: {
        type: :object,
        properties: {
          status: { type: :string },
          description: { type: :string }
        }
      }

      response '200', 'заказ обновлен' do
        schema type: :object,
               properties: {
                 order: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     status: { type: :string },
                     description: { type: :string },
                     updated_at: { type: :string, format: 'date-time' }
                   }
                 }
               }
        it 'returns success' do
        end
      end

      response '422', 'ошибка валидации' do
        schema type: :object, properties: { errors: { type: :object } }
      end

      response '404', 'заказ не найден' do
        schema type: :object, properties: { error: { type: :string } }
      end

      response '401', 'не авторизован' do
        schema type: :object, properties: { error: { type: :string } }
      end

      response '403', 'недостаточно прав' do
        schema type: :object, properties: { error: { type: :string } }
      end
    end
  end

  path '/api/v1/admin/order/user/{user_id}/order/{order_id}/product/{product_id}' do
    parameter name: :user_id, in: :path, type: :integer, required: true, description: 'ID пользователя'
    parameter name: :order_id, in: :path, type: :integer, required: true, description: 'ID заказа'
    parameter name: :product_id, in: :path, type: :integer, required: true, description: 'ID продукта'

    post 'Добавить товар в заказ' do
      tags 'Admin Order'
      security [bearerAuth: []]
      parameter name: :quantity, in: :query, type: :integer, description: 'Количество', default: 1

      response '200', 'товар добавлен' do
        schema type: :object,
               properties: {
                 message: { type: :string },
                 order_item: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     product_id: { type: :integer },
                     quantity: { type: :integer },
                     price: { type: :number }
                   }
                 }
               }
        it 'returns success' do
        end
      end

      response '422', 'ошибка валидации' do
        schema type: :object, properties: { errors: { type: :object } }
      end

      response '404', 'заказ или продукт не найден' do
        schema type: :object, properties: { error: { type: :string } }
      end

      response '401', 'не авторизован' do
        schema type: :object, properties: { error: { type: :string } }
      end

      response '403', 'недостаточно прав' do
        schema type: :object, properties: { error: { type: :string } }
      end
    end

    delete 'Удалить товар из заказа' do
      tags 'Admin Order'
      security [bearerAuth: []]
      parameter name: :quantity, in: :query, type: :integer, description: 'Количество для удаления', default: 1

      response '200', 'товар удален' do
        schema type: :object,
               properties: {
                 message: { type: :string }
               }
        it 'returns success' do
        end
      end

      response '422', 'ошибка валидации' do
        schema type: :object, properties: { errors: { type: :object } }
      end

      response '404', 'заказ или продукт не найден' do
        schema type: :object, properties: { error: { type: :string } }
      end

      response '401', 'не авторизован' do
        schema type: :object, properties: { error: { type: :string } }
      end

      response '403', 'недостаточно прав' do
        schema type: :object, properties: { error: { type: :string } }
      end
    end
  end
end
