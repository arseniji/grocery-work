package com.github.arseniji.barcodescanner.repository

import com.github.arseniji.barcodescanner.model.ScannedItem
import com.github.arseniji.barcodescanner.network.api.BarcodeScannerApi
import com.github.arseniji.barcodescanner.network.api.result.ApiResult
import com.github.arseniji.barcodescanner.network.api.result.safeApiCall
import com.github.arseniji.barcodescanner.network.dto.ProductDto
import java.util.concurrent.ConcurrentHashMap

class ProductRepository(
    private val api: BarcodeScannerApi,
) {
    private val cache = ConcurrentHashMap<String, ProductDto>()

    suspend fun getProduct(barcode: String): ApiResult<ScannedItem> {
        cache[barcode]?.let { return ApiResult.Success(it.toScannedItem()) }

        val result = safeApiCall { api.getProduct(barcode) }
        if (result is ApiResult.Success) cache[barcode] = result.data
        return result.map { it.toScannedItem() }
    }

    fun clearCache() = cache.clear()
}

private fun ProductDto.toScannedItem(quantity: Int = 0) = ScannedItem(
    barcode = barcode,
    quantity = quantity,
    productName = productName,
    measurementUnit = measurementUnit,
    productId = railsId,
)

private fun <T, R> ApiResult<T>.map(transform: (T) -> R): ApiResult<R> = when (this) {
    is ApiResult.Success -> ApiResult.Success(transform(data))
    is ApiResult.Error -> this
}