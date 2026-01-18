require 'swagger_helper'

describe 'Cart API', type: :request do
  path '/api/v1/cart/add' do
    post 'Добавить товар в корзину' do
      tags 'Cart'
      security [bearerAuth: []]
      parameter name: :product_id, in: :query, type: :integer, required: true
      parameter name: :quantity, in: :query, type: :integer, required: true

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

  path '/api/v1/cart/add-one/{product_id}' do
    post 'Увеличить количество товара в корзине' do
      tags 'Cart'
      security [bearerAuth: []]
      parameter name: :product_id, in: :path, type: :integer, required: true

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

  path '/api/v1/cart/remove/{product_id}' do
    delete 'Удалить товар из корзины' do
      tags 'Cart'
      security [bearerAuth: []]
      parameter name: :product_id, in: :path, type: :integer, required: true

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

  path '/api/v1/cart/remove-one/{product_id}' do
    delete 'Уменьшить количество товара в корзине' do
      tags 'Cart'
      security [bearerAuth: []]
      parameter name: :product_id, in: :path, type: :integer, required: true

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

  path '/api/v1/cart/clear' do
    delete 'Очистить корзину' do
      tags 'Cart'
      security [bearerAuth: []]

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

  path '/api/v1/cart/' do
    get 'Получить корзину' do
      tags 'Cart'
      security [bearerAuth: []]

      response '200', 'успешно' do
        schema type: :object,
               properties: {
                 cart: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       product_id: { type: :integer },
                       quantity: { type: :integer },
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
end
