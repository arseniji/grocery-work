package com.github.arseniji.barcodescanner.model.profile

sealed class ProfileUiEvent {
    data object LogoutCLicked : ProfileUiEvent()
    data object LogoutConfirmed: ProfileUiEvent()
    data object LogoutDismissed: ProfileUiEvent()
}