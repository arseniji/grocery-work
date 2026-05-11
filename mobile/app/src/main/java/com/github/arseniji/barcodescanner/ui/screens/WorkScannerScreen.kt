package com.github.arseniji.barcodescanner.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.github.arseniji.barcodescanner.model.ScanMode
import com.github.arseniji.barcodescanner.model.scanner.ScannerUiEffect
import com.github.arseniji.barcodescanner.model.scanner.ScannerUiEvent
import com.github.arseniji.barcodescanner.model.work.WorkUiEffect
import com.github.arseniji.barcodescanner.model.work.WorkUiEvent
import com.github.arseniji.barcodescanner.ui.components.QuantityDialog
import com.github.arseniji.barcodescanner.viewModel.ScannerViewModel
import com.github.arseniji.barcodescanner.viewModel.WorkViewModel
import org.koin.androidx.compose.koinViewModel

@Composable
fun WorkScannerScreen(
    mode: ScanMode,
    workViewModel: WorkViewModel,
    onFinishedScanning: () -> Unit,
    onBack: () -> Unit,
) {
    val context = LocalContext.current
    val scannerViewModel: ScannerViewModel = koinViewModel()
    val scannerState by scannerViewModel.state.collectAsStateWithLifecycle()
    val workState by workViewModel.state.collectAsStateWithLifecycle()

    // Пока открыт диалог количества — анализатор выключен,
    // чтобы не было звуков/вибрации и лишних сканов
    val isScanning = workState.pendingBarcode == null

    LaunchedEffect(Unit) {
        val granted = ContextCompat.checkSelfPermission(
            context, Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED
        scannerViewModel.onEvent(ScannerUiEvent.OnPermissionResult(granted))
    }

    val cameraPermissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        scannerViewModel.onEvent(ScannerUiEvent.OnPermissionResult(granted))
    }

    LaunchedEffect(Unit) {
        scannerViewModel.effect.collect { effect ->
            when (effect) {
                is ScannerUiEffect.BarcodeScanned ->
                    workViewModel.onEvent(WorkUiEvent.OnBarcodeScanned(effect.barcode))
                ScannerUiEffect.NavigateBack -> onBack()
                ScannerUiEffect.RequestCameraPermission ->
                    cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
            }
        }
    }

    LaunchedEffect(Unit) {
        workViewModel.effect.collect { effect ->
            when (effect) {
                WorkUiEffect.FinishScanning -> onFinishedScanning()
                else -> Unit
            }
        }
    }

    BarcodeScannerScreen(
        mode = mode,
        state = scannerState,
        scannedItems = workState.scannedItems,
        canFinish = workState.canFinish,
        isScanning = isScanning,
        onEvent = scannerViewModel::onEvent,
        onWorkEvent = workViewModel::onEvent,
        onFinishClicked = { workViewModel.onEvent(WorkUiEvent.OnFinishClicked) },
    )

    val pendingBarcode = workState.pendingBarcode
    if (pendingBarcode != null) {
        QuantityDialog(
            barcode = pendingBarcode,
            onConfirm = { quantity ->
                workViewModel.onEvent(WorkUiEvent.OnQuantityConfirmed(quantity))
            },
            onDismiss = {
                workViewModel.onEvent(WorkUiEvent.OnDialogDismissed)
            },
        )
    }
}