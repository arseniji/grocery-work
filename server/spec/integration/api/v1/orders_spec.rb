require 'swagger_helper'

describe 'Orders API', type: :request do
  path '/api/v1/order/' do
    get 'Получить заказы пользователя' do
      tags 'Orders'
      security [bearerAuth: []]
      parameter name: :status, in: :query, type: :string, description: 'Статус заказа'
      parameter name: :page, in: :query, type: :integer, description: 'Номер страницы'
      parameter name: :search, in: :query, type: :string, description: 'Поисковый запрос'
      parameter name: :sort, in: :query, type: :string, description: 'Сортировка (например, created_at:desc)'
      parameter name: :page_size, in: :query, type: :integer, description: 'Размер страницы'

      response '200', 'успешно' do
        schema type: :object,
               properties: {
                 orders: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       id: { type: :integer },
                       status: { type: :string },
                       # Добавьте другие поля по необходимости
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

  path '/api/v1/order/{order_id}' do
    get 'Получить детали заказа' do
      tags 'Orders'
      security [bearerAuth: []]
      parameter name: :order_id, in: :path, type: :integer, required: true, description: 'ID заказа'

      response '200', 'успешно' do
        schema type: :object,
               properties: {
                 order: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     status: { type: :string },
                     # Добавьте другие поля
                   }
                 }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end
    end
  end

  path '/api/v1/order/status_collection' do
    get 'Получить все статусы заказов' do
      tags 'Orders'
      security [bearerAuth: []]

      response '200', 'успешно' do
        schema type: :object,
               properties: {
                 statuses: {
                   type: :array,
                   items: { type: :string }
                 }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end
    end
  end

  path '/api/v1/order/create' do
    post 'Создать заказ' do
      tags 'Orders'
      security [bearerAuth: []]
      parameter name: :description, in: :query, type: :string, description: 'Описание заказа'

      response '200', 'успешно' do
        schema type: :object,
               properties: {
                 order: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     status: { type: :string }
                   }
                 }
               }
        it 'returns success' do
        # Здесь можно добавить тестовую логику, но для swaggerize достаточно пустого блока
        end
      end
    end
  end

  path '/api/v1/order/cancellation/{order_id}' do
    delete 'Отменить заказ' do
      tags 'Orders'
      security [bearerAuth: []]
      parameter name: :order_id, in: :path, type: :integer, required: true, description: 'ID заказа'

      response '200', 'успешно' do
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
