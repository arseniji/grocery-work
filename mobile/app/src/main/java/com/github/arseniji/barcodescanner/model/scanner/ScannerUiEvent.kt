package com.github.arseniji.barcodescanner.model.scanner


sealed class ScannerUiEvent {
    data class OnBarcodeScanned(val barcode: String) : ScannerUiEvent()
    data object OnBackClicked : ScannerUiEvent()
    data object OnRequestPermissionClicked : ScannerUiEvent()
    data class OnPermissionResult(val granted: Boolean) : ScannerUiEvent()
}