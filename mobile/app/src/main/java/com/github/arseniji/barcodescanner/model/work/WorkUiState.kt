package com.github.arseniji.barcodescanner.model.work

import com.github.arseniji.barcodescanner.model.ScanMode
import com.github.arseniji.barcodescanner.model.ScannedItem

data class WorkUiState(
    val mode: ScanMode = ScanMode.RECEIVE,
    val scannedItems: List<ScannedItem> = emptyList(),
    val pendingBarcode: String? = null,
    val isSubmitting: Boolean = false,
) {

    val canFinish: Boolean get() = scannedItems.isNotEmpty()
}