package com.github.arseniji.barcodescanner.network.api.result

sealed class ApiResult<out T> {
    data class Success<T>(val data: T) : ApiResult<T>()
    data class Error(val message: String, val code: Int? = null) : ApiResult<Nothing>()

    val isSuccess get() = this is Success
}

suspend fun <T> safeApiCall(call: suspend () -> T): ApiResult<T> = try {
    ApiResult.Success(call())
} catch (e: retrofit2.HttpException) {
    val code = e.code()
    val message = when (code) {
        401 -> "Неверный логин или пароль"
        403 -> "Нет доступа"
        404 -> "Не найдено"
        422 -> "Ошибка валидации"
        in 500..599 -> "Ошибка сервера"
        else -> "Ошибка сети ($code)"
    }
    ApiResult.Error(message, code)
} catch (e: java.net.ConnectException) {
    ApiResult.Error("Не удалось подключиться к серверу")
} catch (e: java.net.SocketTimeoutException) {
    ApiResult.Error("Превышено время ожидания")
} catch (e: Exception) {
    ApiResult.Error(e.message ?: "Неизвестная ошибка")
}
