package com.github.arseniji.barcodescanner.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.github.arseniji.barcodescanner.model.stats.StatsUiEvent
import com.github.arseniji.barcodescanner.model.stats.StatsUiState
import com.github.arseniji.barcodescanner.network.api.result.ApiResult
import com.github.arseniji.barcodescanner.repository.AuthRepository
import com.github.arseniji.barcodescanner.repository.SessionRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.time.LocalDate

class StatsViewModel(
    private val sessionRepository: SessionRepository,
    private val authRepository: AuthRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(StatsUiState())
    val state: StateFlow<StatsUiState> = _state.asStateFlow()

    init {
        viewModelScope.launch {
            authRepository.registrationDate.collect { raw ->
                val date = raw?.let { runCatching { LocalDate.parse(it.take(10)) }.getOrNull() }
                _state.update { it.copy(registrationDate = date) }
            }
        }
        loadSessions()
    }

    fun onEvent(event: StatsUiEvent) {
        when (event) {
            StatsUiEvent.PreviousWeek -> _state.update {
                if (it.canGoBack) it.copy(weekOffset = it.weekOffset - 1) else it
            }
            StatsUiEvent.NextWeek -> _state.update {
                if (it.canGoForward) it.copy(weekOffset = it.weekOffset + 1) else it
            }
            is StatsUiEvent.SelectDay -> _state.update { it.copy(selectedDay = event.date) }
            StatsUiEvent.DismissDay -> _state.update { it.copy(selectedDay = null) }
        }
    }

    fun retry() = loadSessions()

    private fun loadSessions() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true, error = null) }
            when (val result = sessionRepository.getSessions()) {
                is ApiResult.Success -> _state.update {
                    it.copy(isLoading = false, sessions = result.data)
                }
                is ApiResult.Error -> _state.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }
}
