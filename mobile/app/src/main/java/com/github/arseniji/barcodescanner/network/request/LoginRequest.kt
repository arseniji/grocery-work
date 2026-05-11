package com.github.arseniji.barcodescanner.network.request

data class LoginRequest(
    val login: String,
    val password: String,
)
