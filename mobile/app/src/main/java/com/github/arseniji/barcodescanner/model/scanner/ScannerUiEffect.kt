package com.github.arseniji.barcodescanner.model.scanner

sealed class ScannerUiEffect {
    data class BarcodeScanned(val barcode: String) : ScannerUiEffect()
    data object RequestCameraPermission : ScannerUiEffect()
    data object NavigateBack : ScannerUiEffect()
}