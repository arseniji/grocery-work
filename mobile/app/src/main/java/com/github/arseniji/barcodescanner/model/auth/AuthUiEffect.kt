package com.github.arseniji.barcodescanner.model.auth

sealed class AuthUiEffect {
    data object NavigateToHome : AuthUiEffect()
}