package com.github.arseniji.barcodescanner.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp


@Composable
fun QuantityDialog(
    barcode: String,
    onConfirm: (Int) -> Unit,
    onDismiss: () -> Unit
) {
    var text by remember { mutableStateOf("1") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Количество") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Штрихкод: $barcode", style = MaterialTheme.typography.bodySmall)
                OutlinedTextField(
                    value = text,
                    onValueChange = { if (it.all { c -> c.isDigit() }) text = it },
                    label = { Text("Кол-во") },
                    singleLine = true
                )
            }
        },
        confirmButton = {
            Button(onClick = {
                val qty = text.toIntOrNull() ?: 1
                if (qty > 0) onConfirm(qty)
            }) { Text("Добавить") }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Отмена") }
        }
    )
}