package com.github.arseniji.barcodescanner.network.response

import com.google.gson.annotations.SerializedName

data class CreateSessionResponse(
    @SerializedName("session_id") val sessionId: Int,
    val status: String,
)