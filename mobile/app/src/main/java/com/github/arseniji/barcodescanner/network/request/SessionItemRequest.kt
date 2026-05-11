package com.github.arseniji.barcodescanner.network.request

import com.google.gson.annotations.SerializedName

data class SessionItemRequest(
    val barcode: String,
    val quantity: Int,
)