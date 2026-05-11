package com.github.arseniji.barcodescanner.model.auth

data class AuthUiState(
    val login: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val isCheckingAuth: Boolean = true,
    val error: String? = null,
) {
    val canLogin: Boolean get() = login.isNotBlank() && password.isNotBlank() && !isLoading
}