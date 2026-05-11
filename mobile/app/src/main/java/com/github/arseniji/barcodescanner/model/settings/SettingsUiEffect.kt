package com.github.arseniji.barcodescanner.model.settings

sealed class SettingsUiEffect {
    data object ShowSavedConf : SettingsUiEffect()
}