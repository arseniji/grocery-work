package com.github.arseniji.barcodescanner.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Inventory
import androidx.compose.material.icons.filled.MoveToInbox
import androidx.compose.material.icons.filled.RemoveShoppingCart
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.github.arseniji.barcodescanner.model.ScanMode
import com.github.arseniji.barcodescanner.ui.components.ModeCard

@Composable
fun HomeScreen(
    modifier: Modifier = Modifier,
    hasActiveCampaign: Boolean = true,
    onModeSelected: (ScanMode) -> Unit = {},
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Spacer(modifier = Modifier.height(32.dp))

        Text(text = "Добро пожаловать!", style = MaterialTheme.typography.headlineMedium)
        Text(
            text = "Выберите режим работы",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )

        Spacer(modifier = Modifier.height(16.dp))

        ModeCard(
            title = "Приём товара",
            subtitle = "Добавить товар на склад",
            icon = Icons.Default.MoveToInbox,
            onClick = { onModeSelected(ScanMode.RECEIVE) },
        )
        ModeCard(
            title = "Инвентаризация",
            subtitle = if (hasActiveCampaign) "Сверить остатки на складе" else "Нет активной кампании",
            icon = Icons.Default.Inventory,
            onClick = { onModeSelected(ScanMode.INVENTORY) },
            enabled = hasActiveCampaign,
        )
        ModeCard(
            title = "Списание",
            subtitle = "Убрать товар со склада",
            icon = Icons.Default.RemoveShoppingCart,
            onClick = { onModeSelected(ScanMode.WRITE_OFF) },
        )
    }
}