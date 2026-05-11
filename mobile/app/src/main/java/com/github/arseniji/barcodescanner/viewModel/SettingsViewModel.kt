package com.github.arseniji.barcodescanner.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.github.arseniji.barcodescanner.model.settings.SettingsUiEffect
import com.github.arseniji.barcodescanner.model.settings.SettingsUiEvent
import com.github.arseniji.barcodescanner.model.settings.SettingsUiState
import com.github.arseniji.barcodescanner.repository.SettingsRepository
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class SettingsViewModel(
    private val repository: SettingsRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(SettingsUiState())
    val state: StateFlow<SettingsUiState> = _state.asStateFlow()

    private val _effect = Channel<SettingsUiEffect>(Channel.BUFFERED)
    val effect: Flow<SettingsUiEffect> = _effect.receiveAsFlow()

    init {
        // Стейт всегда отражает DataStore — единственный источник правды
        combine(
            repository.isVibrationEnabled,
            repository.isSoundEnabled,
        ) { vibration, sound ->
            SettingsUiState(
                isVibrationEnabled = vibration,
                isSoundEnabled = sound,
            )
        }.onEach { _state.value = it }.launchIn(viewModelScope)
    }

    fun onEvent(event: SettingsUiEvent) {
        when (event) {
            is SettingsUiEvent.ToggleVibration -> saveVibration(event.enabled)
            is SettingsUiEvent.ToggleSound -> saveSound(event.enabled)
        }
    }

    private fun saveVibration(enabled: Boolean) {
        viewModelScope.launch {
            repository.setVibration(enabled)
        }
    }

    private fun saveSound(enabled: Boolean) {
        viewModelScope.launch {
            repository.setSound(enabled)
        }
    }
}