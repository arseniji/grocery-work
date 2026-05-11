package com.github.arseniji.barcodescanner.network.response

data class LoginResponse(
    val accessToken: String,
    val refreshToken: String
)