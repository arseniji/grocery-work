package com.github.arseniji.barcodescanner.model.notifications

import com.github.arseniji.barcodescanner.network.dto.NotificationDto

data class NotificationsUiState(
    val isLoading: Boolean = true,
    val hasActiveCampaign: Boolean = false,
    val notifications: List<NotificationDto> = emptyList(),
    val hasUnread: Boolean = false,
    val isSheetOpen: Boolean = false,
)
