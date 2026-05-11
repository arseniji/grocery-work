package com.github.arseniji.barcodescanner.analyzer

import android.util.Log
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicLong

class BarcodeAnalyzer(
    private val onBarcodeDetected: (String) -> Unit,
    private val timeoutBetweenScans: Long = 500L,
) : ImageAnalysis.Analyzer {

    // Единый атомарный флаг вместо @Volatile var
    val isEnabled = AtomicBoolean(true)

    private val scanner = BarcodeScanning.getClient(
        BarcodeScannerOptions.Builder()
            .setBarcodeFormats(Barcode.FORMAT_EAN_13)
            .build()
    )

    private val lastScanTime = AtomicLong(0)
    private val processing = AtomicBoolean(false)

    @androidx.annotation.OptIn(ExperimentalGetImage::class)
    override fun analyze(imageProxy: ImageProxy) {
        // Читаем оба флага атомарно до любой работы
        if (!isEnabled.get() || processing.get()) {
            imageProxy.close()
            return
        }

        val now = System.currentTimeMillis()
        if (now - lastScanTime.get() < timeoutBetweenScans) {
            imageProxy.close()
            return
        }

        val mediaImage = imageProxy.image
        if (mediaImage == null) {
            imageProxy.close()
            return
        }

        // CAS: только один поток проходит дальше
        if (!processing.compareAndSet(false, true)) {
            imageProxy.close()
            return
        }

        val image = try {
            InputImage.fromMediaImage(mediaImage, imageProxy.imageInfo.rotationDegrees)
        } catch (e: Exception) {
            Log.e("BarcodeAnalyzer", "Failed to create InputImage", e)
            processing.set(false)
            imageProxy.close()
            return
        }

        scanner.process(image)
            .addOnSuccessListener { barcodes ->
                barcodes.firstOrNull()?.rawValue
                    ?.takeIf { it.isNotBlank() }
                    ?.let { onBarcodeDetected(it) }
            }
            .addOnFailureListener { e ->
                Log.e("BarcodeAnalyzer", "Scanning failed", e)
            }
            .addOnCompleteListener {
                // Тайм-аут обновляем всегда — и при успехе, и при ошибке,
                // чтобы не допустить лавины повторных попыток при сбоях ML Kit
                lastScanTime.set(System.currentTimeMillis())
                processing.set(false)
                imageProxy.close()
            }
    }

    fun shutdown() {
        scanner.close()
    }
}