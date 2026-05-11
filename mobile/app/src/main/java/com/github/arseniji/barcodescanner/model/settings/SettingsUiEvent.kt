package com.github.arseniji.barcodescanner.model.settings

sealed class SettingsUiEvent {
    data class ToggleVibration(val enabled: Boolean): SettingsUiEvent()
    data class ToggleSound(val enabled: Boolean): SettingsUiEvent()
}