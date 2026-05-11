package com.github.arseniji.barcodescanner.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.github.arseniji.barcodescanner.model.auth.AuthUiEffect
import com.github.arseniji.barcodescanner.model.auth.AuthUiEvent
import com.github.arseniji.barcodescanner.model.auth.AuthUiState
import com.github.arseniji.barcodescanner.network.api.result.ApiResult
import com.github.arseniji.barcodescanner.repository.AuthRepository
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class AuthViewModel(
    private val authRepository: AuthRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(AuthUiState())
    val state: StateFlow<AuthUiState> = _state.asStateFlow()

    private val _effect = Channel<AuthUiEffect>(Channel.BUFFERED)
    val effect: Flow<AuthUiEffect> = _effect.receiveAsFlow()

    init {
        viewModelScope.launch {
            val loggedIn = authRepository.isLoggedIn.first()
            if (loggedIn) {
                _effect.send(AuthUiEffect.NavigateToHome)
            } else {
                _state.update { it.copy(isCheckingAuth = false) }
            }
        }
    }

    fun onEvent(event: AuthUiEvent) {
        when (event) {
            is AuthUiEvent.OnLoginChange -> _state.update { it.copy(login = event.value, error = null) }
            is AuthUiEvent.OnPasswordChange -> _state.update { it.copy(password = event.value, error = null) }
            AuthUiEvent.OnLoginClicked -> login()
        }
    }

    private fun login() {
        val state = _state.value
        if (!state.canLogin) return

        viewModelScope.launch {
            _state.update { it.copy(isLoading = true, error = null) }
            when (val result = authRepository.login(state.login, state.password)) {
                is ApiResult.Success -> _effect.send(AuthUiEffect.NavigateToHome)
                is ApiResult.Error -> _state.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }
}