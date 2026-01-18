require 'swagger_helper'

describe 'Admin Import Export API', type: :request do
  path '/api/v1/admin/data/import/{entity}' do
    parameter name: :entity, in: :path, type: :string, required: true, description: 'Сущность для импорта (например, products, users)'

    post 'Импорт данных' do
      tags 'Admin Import Export'
      security [bearerAuth: []]
      consumes 'multipart/form-data'
      parameter name: :file, in: :formData, type: :file, required: true, description: 'Файл для импорта'
      parameter name: :file_format, in: :query, type: :string, description: 'Формат файла (json, xml)', default: 'json'

      response '200', 'данные импортированы' do
        schema type: :object,
               properties: {
                 message: { type: :string },
                 imported_count: { type: :integer }
               }
        it 'returns success' do
        end
      end

      response '422', 'ошибка импорта' do
        schema type: :object,
               properties: {
                 errors: {
                   type: :array,
                   items: { type: :string }
                 }
               }
      end

      response '400', 'файл не передан' do
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

  path '/api/v1/admin/data/export/{entity}' do
    parameter name: :entity, in: :path, type: :string, required: true, description: 'Сущность для экспорта (например, products, users)'

    get 'Экспорт данных' do
      tags 'Admin Import Export'
      security [bearerAuth: []]
      produces 'application/json', 'application/xml'
      parameter name: :file_format, in: :query, type: :string, description: 'Формат файла (json, xml)', default: 'json'

      response '200', 'данные экспортированы' do
        schema type: :object,
               properties: {
                 data: { type: :array, items: { type: :object } },
                 exported_at: { type: :string, format: 'date-time' }
               }
        it 'returns success' do
        end
      end

      response '404', 'сущность не найдена' do
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
