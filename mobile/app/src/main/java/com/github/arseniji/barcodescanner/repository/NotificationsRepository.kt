package com.github.arseniji.barcodescanner.repository

import com.github.arseniji.barcodescanner.network.api.BarcodeScannerApi
import com.github.arseniji.barcodescanner.network.api.result.ApiResult
import com.github.arseniji.barcodescanner.network.api.result.safeApiCall
import com.github.arseniji.barcodescanner.network.dto.NotificationsResponseDto

class NotificationsRepository(private val api: BarcodeScannerApi) {
    suspend fun getNotifications(): ApiResult<NotificationsResponseDto> =
        safeApiCall { api.getNotifications() }
}
