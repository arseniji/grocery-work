package com.github.arseniji.barcodescanner.network.request

data class CreateSessionRequest(
    val mode: String,
    val items: List<SessionItemRequest>,
)
