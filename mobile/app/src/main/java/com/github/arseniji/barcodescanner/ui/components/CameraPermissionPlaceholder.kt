package com.github.arseniji.barcodescanner.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

@Composable
fun CameraPermissionPlaceholder(
    modifier: Modifier = Modifier,
    onRequestPermission: () -> Unit
) {
    Column(
        modifier = modifier.background(Color.Black),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Default.CameraAlt,
            contentDescription = null,
            tint = Color.White.copy(alpha = 0.6f)
        )
        Spacer(Modifier.width(12.dp))
        Text(
            text = "Нужен доступ к камере",
            color = Color.White,
            style = MaterialTheme.typography.titleMedium,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 32.dp, vertical = 8.dp)
        )
        Text(
            text = "Без него сканирование штрихкодов невозможно",
            color = Color.White.copy(alpha = 0.6f),
            style = MaterialTheme.typography.bodySmall,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 32.dp)
        )
        Spacer(Modifier.width(16.dp))
        Button(
            onClick = onRequestPermission,
            modifier = Modifier.padding(top = 16.dp)
        ) {
            Text("Разрешить доступ")
        }
    }
}