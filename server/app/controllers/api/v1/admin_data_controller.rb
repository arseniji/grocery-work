class Api::V1::AdminDataController < Api::V1::AdminBaseController
  def import
    file = params[:file]
    unless file
      error = BaseManager.error_response("Файл не передан", code: :file_not_provided)
      render json: error, status: :bad_request
      return
    end

    entity = params[:entity]
    format = detect_format(file, params[:file_format])

    result = ImportExportManager.import(
      entity: entity,
      format: format,
      io: file
    )

    if result[:error].present? || result[:success] == false
      # Устанавливаем статус из результата или по умолчанию
      status = result[:http_status] || :unprocessable_entity
      render json: result, status: status
    else
      render json: result, status: :ok
    end
  end

  def export
    entity = params[:entity]
    format = (params[:file_format] || params[:format] || 'json').to_s

    result = ImportExportManager.export(entity: entity, format: format)

    if result.is_a?(Hash) && result[:content] && result[:filename]
      send_data(
        result[:content],
        filename: result[:filename],
        type: result[:content_type],
        disposition: 'attachment'
      )
    else
      render json: result
    end
  end

  private

  def detect_format(file, param_format)
    return param_format if param_format.present?

    case file.content_type
    when 'application/json', 'text/json'
      'json'
    when 'application/xml', 'text/xml'
      'xml'
    else
      'json'
    end
  end
end