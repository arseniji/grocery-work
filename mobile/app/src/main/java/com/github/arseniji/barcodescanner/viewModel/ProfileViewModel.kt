package com.github.arseniji.barcodescanner.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.github.arseniji.barcodescanner.model.profile.ProfileUiEffect
import com.github.arseniji.barcodescanner.model.profile.ProfileUiEvent
import com.github.arseniji.barcodescanner.model.profile.ProfileUiState
import com.github.arseniji.barcodescanner.repository.AuthRepository
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class ProfileViewModel(
    private val authRepository: AuthRepository,
) : ViewModel() {

    val state: StateFlow<ProfileUiState> = combine(
        authRepository.firstname,
        authRepository.lastname,
        authRepository.registrationDate,
    ) { firstname, lastname, regDateRaw ->
        ProfileUiState(
            name = listOfNotNull(firstname, lastname).joinToString(" ").ifBlank { "Сотрудник" },
            regDate = formatRegDate(regDateRaw),
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), ProfileUiState())

    private val _effect = Channel<ProfileUiEffect>(Channel.BUFFERED)
    val effect: Flow<ProfileUiEffect> = _effect.receiveAsFlow()

    fun onEvent(event: ProfileUiEvent) {
        when (event) {
            ProfileUiEvent.LogoutCLicked ->
                _effect.trySend(ProfileUiEffect.ShowLogoutDialog)
            ProfileUiEvent.LogoutConfirmed -> logout()
            ProfileUiEvent.LogoutDismissed -> Unit
        }
    }

    private fun formatRegDate(raw: String?): String {
        if (raw.isNullOrBlank()) return ""
        return runCatching {
            LocalDate.parse(raw.take(10)).format(DateTimeFormatter.ofPattern("dd.MM.yyyy"))
        }.getOrElse { "" }
    }

    private fun logout() {
        viewModelScope.launch {
            authRepository.logout()
            _effect.send(ProfileUiEffect.NavigateToAuth)
        }
    }
}