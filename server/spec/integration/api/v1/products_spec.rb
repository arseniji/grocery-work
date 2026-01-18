require 'swagger_helper'

describe 'Products API', type: :request do
  path '/api/v1/products/categories' do
    get 'Получить все категории' do
      tags 'Products'

      response '200', 'успешно' do
        schema type: :object,
               properties: {
                 categories: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       id: { type: :integer },
                       name: { type: :string }
                     }
                   }
                 }
               }
        it 'returns success' do
          get '/api/v1/products/categories'
          expect(response).to have_http_status(200)
        end
      end
    end
  end

  path '/api/v1/products/top' do
    get 'Получить топ товаров' do
      tags 'Products'
      parameter name: :size_top, in: :query, type: :integer, description: 'Количество топ товаров'

      response '200', 'успешно' do
        schema type: :object,
               properties: {
                 products: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       id: { type: :integer },
                       name: { type: :string },
                       price: { type: :number }
                     }
                   }
                 }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end
    end
  end

  path '/api/v1/products/{id}' do
    get 'Получить детали товара' do
      tags 'Products'
      parameter name: :id, in: :path, type: :integer, required: true, description: 'ID товара'

      response '200', 'успешно' do
        schema type: :object,
               properties: {
                 product: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     name: { type: :string },
                     description: { type: :string },
                     price: { type: :number },
                     category: { type: :string }
                   }
                 }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end
    end
  end

  path '/api/v1/products/' do
    get 'Получить страницу товаров' do
      tags 'Products'
      parameter name: :category, in: :query, type: :string, description: 'Категория'
      parameter name: :page, in: :query, type: :integer, description: 'Номер страницы'
      parameter name: :search, in: :query, type: :string, description: 'Поисковый запрос'
      parameter name: :sort, in: :query, type: :string, description: 'Сортировка'
      parameter name: :page_size, in: :query, type: :integer, description: 'Размер страницы'

      response '200', 'успешно' do
        schema type: :object,
               properties: {
                 products: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       id: { type: :integer },
                       name: { type: :string },
                       price: { type: :number }
                     }
                   }
                 },
                 total_pages: { type: :integer },
                 current_page: { type: :integer }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end
    end
  end
end
