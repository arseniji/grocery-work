require 'swagger_helper'

describe 'Admin Command API', type: :request do
  path '/api/v1/admin/command/undo' do
    post 'Отменить последнюю команду' do
      tags 'Admin Command'
      security [bearerAuth: []]

      response '200', 'команда отменена' do
        schema type: :object,
               properties: {
                 message: { type: :string }
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

  path '/api/v1/admin/command/redo' do
    post 'Повторить отмененную команду' do
      tags 'Admin Command'
      security [bearerAuth: []]

      response '200', 'команда повторена' do
        schema type: :object,
               properties: {
                 message: { type: :string }
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

  path '/api/v1/admin/command/history' do
    get 'Получить историю команд' do
      tags 'Admin Command'
      security [bearerAuth: []]

      response '200', 'история команд' do
        schema type: :object,
               properties: {
                 history: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       id: { type: :integer },
                       action: { type: :string },
                       created_at: { type: :string, format: 'date-time' }
                     }
                   }
                 }
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

    delete 'Очистить историю команд' do
      tags 'Admin Command'
      security [bearerAuth: []]

      response '200', 'история очищена' do
        schema type: :object,
               properties: {
                 message: { type: :string }
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
