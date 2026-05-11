package com.github.arseniji.barcodescanner.repository

import com.github.arseniji.barcodescanner.model.ScanMode
import com.github.arseniji.barcodescanner.model.ScannedItem
import com.github.arseniji.barcodescanner.network.api.BarcodeScannerApi
import com.github.arseniji.barcodescanner.network.api.result.ApiResult
import com.github.arseniji.barcodescanner.network.api.result.safeApiCall
import com.github.arseniji.barcodescanner.network.dto.SessionDto
import com.github.arseniji.barcodescanner.network.request.CreateSessionRequest
import com.github.arseniji.barcodescanner.network.request.SessionItemRequest


class SessionRepository(
    private val api: BarcodeScannerApi,
) {
    suspend fun submitSession(mode: ScanMode, items: List<ScannedItem>): ApiResult<Unit> {
        val request = CreateSessionRequest(
            mode = mode.name,
            items = items.map { item ->
                SessionItemRequest(
                    barcode = item.barcode,
                    quantity = item.quantity,
                )
            },
        )
        return safeApiCall { api.createSession(request) }
    }

    suspend fun getSessions(): ApiResult<List<SessionDto>> =
        safeApiCall { api.getSessions() }

    suspend fun getSession(id: Int): ApiResult<SessionDto> =
        safeApiCall { api.getSession(id) }
}

private fun <T, R> ApiResult<T>.map(transform: (T) -> R): ApiResult<R> = when (this) {
    is ApiResult.Success -> ApiResult.Success(transform(data))
    is ApiResult.Error -> this
}