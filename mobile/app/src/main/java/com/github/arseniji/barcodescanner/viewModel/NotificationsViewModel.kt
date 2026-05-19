package com.github.arseniji.barcodescanner.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.github.arseniji.barcodescanner.model.notifications.NotificationsUiState
import com.github.arseniji.barcodescanner.network.api.result.ApiResult
import com.github.arseniji.barcodescanner.repository.AuthRepository
import com.github.arseniji.barcodescanner.repository.NotificationsRepository
import com.github.arseniji.barcodescanner.util.AudioHelper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class NotificationsViewModel(
    private val notificationsRepository: NotificationsRepository,
    private val authRepository: AuthRepository,
    private val audioHelper: AudioHelper,
) : ViewModel() {

    private val _state = MutableStateFlow(NotificationsUiState())
    val state: StateFlow<NotificationsUiState> = _state.asStateFlow()

    init {
        load()
    }

    fun load() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            when (val result = notificationsRepository.getNotifications()) {
                is ApiResult.Success -> {
                    val data = result.data
                    val lastSeen = authRepository.lastSeenNotificationId.first()
                    val maxId = data.notifications.maxOfOrNull { it.id } ?: 0
                    val wasUnread = _state.value.hasUnread
                    val nowUnread = maxId > lastSeen
                    // Звук — только когда появляются новые уведомления, которых раньше не было
                    if (nowUnread && !wasUnread) {
                        audioHelper.playNotification()
                    }
                    _state.update {
                        it.copy(
                            isLoading = false,
                            hasActiveCampaign = data.hasActiveCampaign,
                            notifications = data.notifications,
                            hasUnread = nowUnread,
                        )
                    }
                }
                is ApiResult.Error -> _state.update { it.copy(isLoading = false) }
            }
        }
    }

    fun openSheet() {
        _state.update { it.copy(isSheetOpen = true) }
        viewModelScope.launch {
            val maxId = _state.value.notifications.maxOfOrNull { it.id } ?: 0
            authRepository.markNotificationsSeen(maxId)
            _state.update { it.copy(hasUnread = false) }
        }
    }

    fun closeSheet() {
        _state.update { it.copy(isSheetOpen = false) }
    }
}
