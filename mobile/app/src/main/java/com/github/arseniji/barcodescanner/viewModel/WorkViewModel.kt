package com.github.arseniji.barcodescanner.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.github.arseniji.barcodescanner.model.ScanMode
import com.github.arseniji.barcodescanner.model.ScannedItem
import com.github.arseniji.barcodescanner.model.work.WorkUiEffect
import com.github.arseniji.barcodescanner.model.work.WorkUiEvent
import com.github.arseniji.barcodescanner.model.work.WorkUiState
import com.github.arseniji.barcodescanner.network.api.result.ApiResult
import com.github.arseniji.barcodescanner.repository.DraftSessionRepository
import com.github.arseniji.barcodescanner.repository.ProductRepository
import com.github.arseniji.barcodescanner.repository.SessionRepository
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.drop
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class WorkViewModel(
    private val sessionRepository: SessionRepository,
    private val productRepository: ProductRepository,
    private val draftRepository: DraftSessionRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(WorkUiState())
    val state: StateFlow<WorkUiState> = _state.asStateFlow()

    init {
        restoreDraft()
        viewModelScope.launch {
            _state.drop(1).collect { state ->
                if (state.scannedItems.isNotEmpty()) {
                    draftRepository.saveDraft(state.scannedItems, state.mode)
                }
            }
        }
    }

    private fun restoreDraft() {
        viewModelScope.launch {
            val (items, mode) = draftRepository.loadDraft()
            if (items.isNotEmpty()) {
                _state.update {
                    it.copy(
                        scannedItems = items,
                        mode = mode ?: ScanMode.INVENTORY
                    )
                }
            }
        }
    }

    private val _effect = Channel<WorkUiEffect>(Channel.BUFFERED)
    val effect: Flow<WorkUiEffect> = _effect.receiveAsFlow()

    fun onEvent(event: WorkUiEvent) {
        when (event) {
            is WorkUiEvent.OnBarcodeScanned          -> handleBarcode(event.barcode)
            is WorkUiEvent.OnQuantityConfirmed        -> handleQuantity(event.quantity)
            WorkUiEvent.OnDialogDismissed             -> _state.update { it.copy(pendingBarcode = null) }
            WorkUiEvent.OnFinishClicked               -> _effect.trySend(WorkUiEffect.FinishScanning)
            WorkUiEvent.OnSendAndClose                -> submitToServer()
            WorkUiEvent.OnCancel                      -> clearItems()
            is WorkUiEvent.OnItemDeleted              -> deleteItem(event.barcode)
            is WorkUiEvent.OnItemQuantityIncrement    -> changeQuantity(event.barcode, +1)
            is WorkUiEvent.OnItemQuantityDecrement    -> changeQuantity(event.barcode, -1)
            is WorkUiEvent.OnItemQuantitySet          -> setQuantity(event.barcode, event.quantity)
        }
    }

    private fun handleBarcode(barcode: String) {
        if (_state.value.pendingBarcode != null) return
        if (barcode.length != 13 || !barcode.all { it.isDigit() }) return
        when (_state.value.mode) {
            ScanMode.INVENTORY -> {
                addItem(ScannedItem(barcode = barcode, quantity = 1))
                fetchProductInfo(barcode)
            }
            ScanMode.RECEIVE, ScanMode.WRITE_OFF -> {
                _state.update { it.copy(pendingBarcode = barcode) }
                _effect.trySend(WorkUiEffect.ShowQuantityDialog(barcode))
            }
        }
    }

    private fun handleQuantity(quantity: Int) {
        val barcode = _state.value.pendingBarcode ?: return
        if (quantity <= 0) return
        addItem(ScannedItem(barcode = barcode, quantity = quantity))
        _state.update { it.copy(pendingBarcode = null) }
        fetchProductInfo(barcode)
    }

    private fun deleteItem(barcode: String) {
        _state.update { current ->
            current.copy(scannedItems = current.scannedItems.filter { it.barcode != barcode })
        }
    }

    private fun changeQuantity(barcode: String, delta: Int) {
        _state.update { current ->
            val updated = current.scannedItems.mapNotNull { item ->
                if (item.barcode == barcode) {
                    val newQty = item.quantity + delta
                    if (newQty <= 0) null else item.copy(quantity = newQty)
                } else item
            }
            current.copy(scannedItems = updated)
        }
    }

    private fun setQuantity(barcode: String, quantity: Int) {
        if (quantity <= 0) {
            deleteItem(barcode)
            return
        }
        _state.update { current ->
            val updated = current.scannedItems.map { item ->
                if (item.barcode == barcode) item.copy(quantity = quantity) else item
            }
            current.copy(scannedItems = updated)
        }
    }

    private fun fetchProductInfo(barcode: String) {
        viewModelScope.launch {
            when (val result = productRepository.getProduct(barcode)) {
                is ApiResult.Success -> {
                    val fetched = result.data
                    _state.update { current ->
                        val updated = current.scannedItems.map { item ->
                            if (item.barcode == barcode) {
                                item.copy(
                                    productName = fetched.productName,
                                    productId = fetched.productId,
                                    measurementUnit = fetched.measurementUnit,
                                )
                            } else item
                        }
                        current.copy(scannedItems = updated)
                    }
                }
                is ApiResult.Error -> { }
            }
        }
    }

    fun setMode(mode: ScanMode) {
        _state.update {
            if (it.mode != mode) {
                it.copy(mode = mode, scannedItems = emptyList(), pendingBarcode = null)
            } else {
                it.copy(mode = mode)
            }
        }
    }

    private fun addItem(item: ScannedItem) {
        _state.update { current ->
            val items = current.scannedItems
            val index = items.indexOfFirst { it.barcode == item.barcode }
            val updated = if (index != -1) {
                items.toMutableList().apply {
                    this[index] = this[index].copy(quantity = this[index].quantity + item.quantity)
                }
            } else {
                items + item
            }
            current.copy(scannedItems = updated)
        }
    }

    private fun clearItems() {
        _state.update { it.copy(scannedItems = emptyList(), pendingBarcode = null) }
        productRepository.clearCache()
        viewModelScope.launch { draftRepository.clearDraft() }
    }

    private fun submitToServer() {
        val state = _state.value
        viewModelScope.launch {
            _state.update { it.copy(isSubmitting = true) }
            when (val result = sessionRepository.submitSession(state.mode, state.scannedItems)) {
                is ApiResult.Success -> {
                    draftRepository.clearDraft()
                    clearItems()
                    _effect.send(WorkUiEffect.SubmitSuccess)
                }
                is ApiResult.Error -> {
                    _state.update { it.copy(isSubmitting = false) }
                    _effect.send(WorkUiEffect.SubmitError(result.message))
                }
            }
        }
    }
}
