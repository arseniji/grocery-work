package com.github.arseniji.barcodescanner.model.work

sealed class WorkUiEvent {
    data class OnBarcodeScanned(val barcode: String) : WorkUiEvent()
    data class OnQuantityConfirmed(val quantity: Int) : WorkUiEvent()
    data object OnDialogDismissed : WorkUiEvent()
    data object OnFinishClicked : WorkUiEvent()
    data object OnSendAndClose : WorkUiEvent()
    data object OnCancel : WorkUiEvent()

    data class OnItemDeleted(val barcode: String) : WorkUiEvent()
    data class OnItemQuantityIncrement(val barcode: String) : WorkUiEvent()
    data class OnItemQuantityDecrement(val barcode: String) : WorkUiEvent()
    data class OnItemQuantitySet(val barcode: String, val quantity: Int) : WorkUiEvent()
}
