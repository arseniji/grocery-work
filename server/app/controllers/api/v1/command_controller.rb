class Api::V1::CommandController < Api::V1::AdminBaseController
  def undo
    result = CommandManager.undo(@current_user.id)
    render json: result
  end

  def redo
    result = CommandManager.redo(@current_user.id)
    render json: result
  end

  def history
    result = CommandManager.get_user_history(@current_user.id)
    render json: result
  end

  def clear_history
    result = CommandManager.clear_history(@current_user.id)
    render json: result
  end
end
