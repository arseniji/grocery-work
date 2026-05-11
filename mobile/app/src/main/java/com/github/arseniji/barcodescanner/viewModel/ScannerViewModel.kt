package com.github.arseniji.barcodescanner.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.github.arseniji.barcodescanner.model.scanner.ScannerUiEffect
import com.github.arseniji.barcodescanner.model.scanner.ScannerUiEvent
import com.github.arseniji.barcodescanner.model.scanner.ScannerUiState
import com.github.arseniji.barcodescanner.repository.SettingsRepository
import com.github.arseniji.barcodescanner.util.AudioHelper
import com.github.arseniji.barcodescanner.util.VibrationHelper
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update

class ScannerViewModel(
    private val settingsRepository: SettingsRepository,
    private val audioHelper: AudioHelper,
    private val vibrationHelper: VibrationHelper,
) : ViewModel() {

    private val _state = MutableStateFlow(ScannerUiState())
    val state: StateFlow<ScannerUiState> = _state.asStateFlow()

    private val _effect = Channel<ScannerUiEffect>(Channel.BUFFERED)
    val effect: Flow<ScannerUiEffect> = _effect.receiveAsFlow()

    private var vibrationEnabled = true
    private var soundEnabled = true

    init {
        settingsRepository.isVibrationEnabled
            .onEach { vibrationEnabled = it }
            .launchIn(viewModelScope)
        settingsRepository.isSoundEnabled
            .onEach { soundEnabled = it }
            .launchIn(viewModelScope)
    }

    fun onEvent(event: ScannerUiEvent) {
        when (event) {
            is ScannerUiEvent.OnBarcodeScanned -> {
                if (vibrationEnabled) vibrationHelper.vibrate()
                if (soundEnabled) audioHelper.playBeep()
                _effect.trySend(ScannerUiEffect.BarcodeScanned(event.barcode))
            }
            ScannerUiEvent.OnBackClicked ->
                _effect.trySend(ScannerUiEffect.NavigateBack)
            ScannerUiEvent.OnRequestPermissionClicked ->
                _effect.trySend(ScannerUiEffect.RequestCameraPermission)
            is ScannerUiEvent.OnPermissionResult ->
                _state.update { it.copy(isCameraPermissionGranted = event.granted) }
        }
    }
    // onCleared убран — AudioHelper синглтон, release() не нужен
}