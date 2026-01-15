require 'swagger_helper'

describe 'Admin Product API', type: :request do
  path '/api/v1/admin/product' do
    get 'Получить список продуктов' do
      tags 'Admin Product'
      security [bearerAuth: []]
      parameter name: :page_size, in: :query, type: :integer, description: 'Размер страницы', default: 50
      parameter name: :page, in: :query, type: :integer, description: 'Номер страницы', default: 1
      parameter name: :category, in: :query, type: :string, description: 'Категория'
      parameter name: :search, in: :query, type: :string, description: 'Поисковый запрос'
      parameter name: :sorted_fields, in: :query, type: :string, description: 'Поля сортировки'

      response '200', 'список продуктов' do
        schema type: :object,
               properties: {
                 products: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       id: { type: :integer },
                       product_name: { type: :string },
                       price: { type: :string },
                       rating: { type: :string },
                       category: { type: :string },
                       quantity: { type: :integer },
                       measurement_unit: { type: :string },
                       description: { type: :string },
                       img_path: { type: :string },
                       created_at: { type: :string, format: 'date-time' },
                       updated_at: { type: :string, format: 'date-time' }
                     }
                   }
                 },
                 total_pages: { type: :integer },
                 current_page: { type: :integer }
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

    post 'Добавить продукт' do
    tags 'Admin Product'
    security [bearerAuth: []]
    consumes 'application/json'
    produces 'application/json'
    parameter name: :product, in: :body, schema: {
        type: :object,
        properties: {
        product_name: { type: :string },
        price: { type: :number },
        rating: { type: :number },
        category: { type: :string },
        quantity: { type: :integer },
        measurement_unit: { type: :string },
        description: { type: :string },
        image: { type: :string, description: 'Изображение (base64/URL)'}
        },
        required: ['product_name', 'price', 'category', 'quantity']
    }
      response '200', 'продукт добавлен' do
        schema type: :object,
               properties: {
                 product: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     product_name: { type: :string },
                     price: { type: :string },
                     rating: { type: :string },
                     category: { type: :string },
                     quantity: { type: :integer },
                     measurement_unit: { type: :string },
                     description: { type: :string },
                     img_path: { type: :string },
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

  path '/api/v1/admin/product/{id}' do
    parameter name: :id, in: :path, type: :integer, required: true, description: 'ID продукта'

    get 'Получить детали продукта' do
      tags 'Admin Product'
      security [bearerAuth: []]

      response '200', 'детали продукта' do
        schema type: :object,
               properties: {
                 product: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     product_name: { type: :string },
                     price: { type: :string },
                     rating: { type: :string },
                     category: { type: :string },
                     quantity: { type: :integer },
                     measurement_unit: { type: :string },
                     description: { type: :string },
                     img_path: { type: :string },
                     created_at: { type: :string, format: 'date-time' },
                     updated_at: { type: :string, format: 'date-time' }
                   }
                 }
               }
        it 'returns success' do
          # Здесь можно добавить тестовую логику
        end
      end

      response '404', 'продукт не найден' do
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

    put 'Обновить продукт' do
        tags 'Admin Product'
        security [bearerAuth: []]
        consumes 'application/json'
        produces 'application/json'
        parameter name: :product, in: :body, schema: {
            type: :object,
            properties: {
            product_name: { type: :string },
            price: { type: :number },
            rating: { type: :number },
            category: { type: :string },
            quantity: { type: :integer },
            measurement_unit: { type: :string },
            description: { type: :string },
            image: { type: :string, description: 'Изображение (base64/URL)'}
            }
        }
      response '200', 'продукт обновлен' do
        schema type: :object,
               properties: {
                 product: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     product_name: { type: :string },
                     price: { type: :string },
                     rating: { type: :string },
                     category: { type: :string },
                     quantity: { type: :integer },
                     measurement_unit: { type: :string },
                     description: { type: :string },
                     img_path: { type: :string },
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

      response '404', 'продукт не найден' do
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

    delete 'Удалить продукт' do
      tags 'Admin Product'
      security [bearerAuth: []]

      response '200', 'продукт удален' do
        schema type: :object,
               properties: {
                 message: { type: :string }
               }
        it 'returns success' do
          # Здесь можно добавить тестовую логику
        end
      end

      response '404', 'продукт не найден' do
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
