package com.github.arseniji.barcodescanner.model.auth

sealed class AuthUiEvent {
    data class OnLoginChange(val value: String) : AuthUiEvent()
    data class OnPasswordChange(val value: String) : AuthUiEvent()
    data object OnLoginClicked : AuthUiEvent()
}