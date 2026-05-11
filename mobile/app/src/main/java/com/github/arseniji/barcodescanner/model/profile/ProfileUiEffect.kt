package com.github.arseniji.barcodescanner.model.profile

sealed class ProfileUiEffect {
    data object ShowLogoutDialog : ProfileUiEffect()
    data object NavigateToAuth : ProfileUiEffect()
    data class ShowError(val message: String) : ProfileUiEffect()
}