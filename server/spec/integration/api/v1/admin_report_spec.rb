require 'swagger_helper'

describe 'Admin Report API', type: :request do
  path '/api/v1/admin/report/' do
    get 'Получить отчет' do
      tags 'Admin Report'
      security [bearerAuth: []]
      parameter name: :type, in: :query, type: :string, description: 'Тип отчета (products, users, orders)', required: true

      response '200', 'отчет' do
        schema type: :object,
               properties: {
                 report: { type: :object }  # Уточни схему в зависимости от типа отчета
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
end
