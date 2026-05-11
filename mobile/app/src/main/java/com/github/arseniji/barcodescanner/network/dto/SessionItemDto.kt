package com.github.arseniji.barcodescanner.network.dto

import com.google.gson.annotations.SerializedName

data class SessionItemDto(
    val id: Int,
    val barcode: String,
    @SerializedName("product_name") val productName: String?,
    val quantity: Int,
    @SerializedName("created_at") val createdAt: String,
)