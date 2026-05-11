package com.github.arseniji.barcodescanner.network.dto

data class EmployeeDto(
    val id: Int,
    val firstname: String,
    val lastname: String,
    @com.google.gson.annotations.SerializedName("created_at") val createdAt: String?,
)
