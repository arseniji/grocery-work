package com.github.arseniji.barcodescanner.network.dto

import com.google.gson.annotations.SerializedName

data class SessionDto(
    val id: Int,
    @SerializedName("employee_id") val employeeId: Int,
    val mode: String,
    val status: String,
    @SerializedName("created_at") val createdAt: String,
    @SerializedName("completed_at") val completedAt: String?,
    val items: List<SessionItemDto>?,
)