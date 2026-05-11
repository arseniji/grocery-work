package com.github.arseniji.barcodescanner.model.work

sealed class WorkUiEffect{
    data class ShowQuantityDialog(val barcode: String) : WorkUiEffect()
    data object FinishScanning : WorkUiEffect()
    data object SubmitSuccess : WorkUiEffect()
    data class SubmitError(val message: String) : WorkUiEffect()
}
