package com.github.arseniji.barcodescanner.network.dto

import com.google.gson.annotations.SerializedName

data class ProductDto(
    @SerializedName("rails_id") val railsId: Int,
    val barcode: String,
    @SerializedName("product_name") val productName: String,
    val quantity: Int,
    @SerializedName("measurement_unit") val measurementUnit: String?,
)