package com.github.arseniji.barcodescanner.model

import kotlinx.serialization.Serializable

@Serializable
data class ScannedItem(
    val barcode: String,
    val quantity: Int,
    val productName: String? = null,
    val category: String? = null,
    val productId: Int? = null,
    val measurementUnit: String? = null
)