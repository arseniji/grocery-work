package com.github.arseniji.barcodescanner.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.github.arseniji.barcodescanner.model.ScanMode
import com.github.arseniji.barcodescanner.model.ScannedItem
import com.github.arseniji.barcodescanner.model.scanner.ScannerUiEvent
import com.github.arseniji.barcodescanner.model.scanner.ScannerUiState
import com.github.arseniji.barcodescanner.model.work.WorkUiEvent
import com.github.arseniji.barcodescanner.ui.components.CameraPermissionPlaceholder
import com.github.arseniji.barcodescanner.ui.components.CameraPreview
import com.github.arseniji.barcodescanner.ui.components.ScannedItemRow

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BarcodeScannerScreen(
    mode: ScanMode,
    state: ScannerUiState,
    scannedItems: List<ScannedItem>,
    canFinish: Boolean,
    isScanning: Boolean,
    onEvent: (ScannerUiEvent) -> Unit,
    onWorkEvent: (WorkUiEvent) -> Unit,
    onFinishClicked: () -> Unit,
) {
    Box(modifier = Modifier.fillMaxSize()) {

        if (state.isCameraPermissionGranted) {
            CameraPreview(
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxHeight(0.6f),
                onScan = { barcode -> onEvent(ScannerUiEvent.OnBarcodeScanned(barcode)) },
                isScanning = isScanning,
            )
        } else {
            CameraPermissionPlaceholder(
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxHeight(0.6f),
                onRequestPermission = { onEvent(ScannerUiEvent.OnRequestPermissionClicked) },
            )
        }

        TopAppBar(
            title = { Text(mode.title, color = Color.White) },
            navigationIcon = {
                IconButton(onClick = { onEvent(ScannerUiEvent.OnBackClicked) }) {
                    Icon(
                        Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Назад",
                        tint = Color.White,
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Transparent),
            modifier = Modifier.statusBarsPadding(),
        )

        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .fillMaxHeight(0.45f)
                .background(MaterialTheme.colorScheme.surface),
        ) {
            var manualBarcode by remember { mutableStateOf("") }

            fun submitManual() {
                val trimmed = manualBarcode.trim()
                if (trimmed.length == 13 && trimmed.all { it.isDigit() }) {
                    onEvent(ScannerUiEvent.OnBarcodeScanned(trimmed))
                    manualBarcode = ""
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    "Отсканировано ${scannedItems.size} позиций",
                    style = MaterialTheme.typography.titleSmall,
                )
                if (canFinish) {
                    Button(onClick = onFinishClicked) {
                        Icon(Icons.Default.Check, contentDescription = null)
                        Spacer(Modifier.width(4.dp))
                        Text("Готово")
                    }
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .padding(bottom = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                OutlinedTextField(
                    value = manualBarcode,
                    onValueChange = { manualBarcode = it },
                    modifier = Modifier.weight(1f),
                    placeholder = { Text("Введите штрихкод") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Number,
                        imeAction = ImeAction.Send,
                    ),
                    keyboardActions = KeyboardActions(onSend = { submitManual() }),
                )
                IconButton(onClick = { submitManual() }) {
                    Icon(Icons.Default.Send, contentDescription = "Отправить")
                }
            }

            HorizontalDivider()

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
            ) {
                items(scannedItems, key = { it.barcode }) { item ->
                    ScannedItemRow(
                        item = item,
                        mode = mode,
                        onIncrement  = { onWorkEvent(WorkUiEvent.OnItemQuantityIncrement(item.barcode)) },
                        onDecrement  = { onWorkEvent(WorkUiEvent.OnItemQuantityDecrement(item.barcode)) },
                        onDelete     = { onWorkEvent(WorkUiEvent.OnItemDeleted(item.barcode)) },
                        onQuantitySet = { qty -> onWorkEvent(WorkUiEvent.OnItemQuantitySet(item.barcode, qty)) },
                    )
                }
            }
        }
    }
}
