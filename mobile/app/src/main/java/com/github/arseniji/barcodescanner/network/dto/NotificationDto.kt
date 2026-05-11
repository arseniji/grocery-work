package com.github.arseniji.barcodescanner.network.dto

import com.google.gson.annotations.SerializedName

data class NotificationDto(
    val id: Int,
    val type: String,
    @SerializedName("campaign_title") val campaignTitle: String,
    val description: String?,
    @SerializedName("created_at") val createdAt: String,
)
