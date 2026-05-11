package com.github.arseniji.barcodescanner.network.dto

import com.google.gson.annotations.SerializedName

data class NotificationsResponseDto(
    @SerializedName("has_active_campaign") val hasActiveCampaign: Boolean,
    val notifications: List<NotificationDto>,
)
