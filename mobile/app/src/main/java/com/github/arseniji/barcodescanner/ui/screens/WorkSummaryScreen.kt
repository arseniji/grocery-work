package com.github.arseniji.barcodescanner.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.github.arseniji.barcodescanner.model.ScanMode
import com.github.arseniji.barcodescanner.model.work.WorkUiEffect
import com.github.arseniji.barcodescanner.model.work.WorkUiEvent
import com.github.arseniji.barcodescanner.ui.components.ScannedItemRow
import com.github.arseniji.barcodescanner.viewModel.WorkViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkSummaryScreen(
    workViewModel: WorkViewModel,
    onDone: () -> Unit,
    onCancel: () -> Unit,
    onContinueScanning: () -> Unit,
) {
    val state by workViewModel.state.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(Unit) {
        workViewModel.effect.collect { effect ->
            when (effect) {
                WorkUiEffect.SubmitSuccess -> onDone()
                is WorkUiEffect.SubmitError -> snackbarHostState.showSnackbar(effect.message)
                else -> Unit
            }
        }
    }

    val totalUnits = state.scannedItems.sumOf { it.quantity }
    val modeColor = when (state.mode) {
        ScanMode.RECEIVE   -> MaterialTheme.colorScheme.primary
        ScanMode.WRITE_OFF -> MaterialTheme.colorScheme.error
        ScanMode.INVENTORY -> MaterialTheme.colorScheme.tertiary
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            TopAppBar(
                title = { Text("Итоги сессии") },
                actions = {
                    SuggestionChip(
                        onClick = {},
                        label = { Text(state.mode.title) },
                        colors = SuggestionChipDefaults.suggestionChipColors(
                            containerColor = modeColor.copy(alpha = 0.12f),
                            labelColor = modeColor,
                        ),
                        modifier = Modifier.padding(end = 8.dp),
                    )
                },
            )
        },
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize(),
        ) {
            // Статистика
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                StatChip(label = "Позиций", value = "${state.scannedItems.size}")
                StatChip(label = "Единиц", value = "$totalUnits")
            }

            HorizontalDivider()

            LazyColumn(
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
            ) {
                items(state.scannedItems, key = { it.barcode }) { item ->
                    ScannedItemRow(
                        item = item,
                        mode = state.mode,
                        onIncrement   = { workViewModel.onEvent(WorkUiEvent.OnItemQuantityIncrement(item.barcode)) },
                        onDecrement   = { workViewModel.onEvent(WorkUiEvent.OnItemQuantityDecrement(item.barcode)) },
                        onDelete      = { workViewModel.onEvent(WorkUiEvent.OnItemDeleted(item.barcode)) },
                        onQuantitySet = { qty -> workViewModel.onEvent(WorkUiEvent.OnItemQuantitySet(item.barcode, qty)) },
                    )
                }
            }

            HorizontalDivider()

            // Кнопки
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Button(
                        onClick = { workViewModel.onEvent(WorkUiEvent.OnSendAndClose) },
                        enabled = !state.isSubmitting && state.scannedItems.isNotEmpty(),
                        modifier = Modifier.weight(1f),
                    ) {
                        if (state.isSubmitting) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                strokeWidth = 2.dp,
                                color = MaterialTheme.colorScheme.onPrimary,
                            )
                        } else {
                            Text("Отправить и закрыть")
                        }
                    }
                    OutlinedButton(
                        onClick = {
                            workViewModel.onEvent(WorkUiEvent.OnCancel)
                            onCancel()
                        },
                        modifier = Modifier.weight(1f),
                    ) {
                        Text("Отменить")
                    }
                }
                OutlinedButton(
                    onClick = onContinueScanning,
                    enabled = !state.isSubmitting,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text("Продолжить сканирование")
                }
            }
        }
    }
}

@Composable
private fun StatChip(label: String, value: String) {
    Surface(
        shape = MaterialTheme.shapes.small,
        color = MaterialTheme.colorScheme.surfaceVariant,
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
        ) {
            Text(
                text = value,
                style = MaterialTheme.typography.titleMedium,
            )
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}
