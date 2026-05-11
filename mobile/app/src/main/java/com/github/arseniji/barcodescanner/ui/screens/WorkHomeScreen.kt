package com.github.arseniji.barcodescanner.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.LifecycleEventEffect
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.github.arseniji.barcodescanner.model.ScanMode
import com.github.arseniji.barcodescanner.network.dto.NotificationDto
import com.github.arseniji.barcodescanner.viewModel.NotificationsViewModel
import com.github.arseniji.barcodescanner.viewModel.WorkViewModel
import org.koin.androidx.compose.koinViewModel
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkHomeScreen(
    onModeSelected: (ScanMode) -> Unit,
    workViewModel: WorkViewModel,
) {
    val notificationsViewModel: NotificationsViewModel = koinViewModel()
    val state by notificationsViewModel.state.collectAsStateWithLifecycle()
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    LifecycleEventEffect(Lifecycle.Event.ON_RESUME) {
        notificationsViewModel.load()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Работа") },
                actions = {
                    BadgedBox(
                        badge = {
                            if (state.hasUnread) Badge()
                        },
                        modifier = Modifier.padding(end = 8.dp),
                    ) {
                        IconButton(onClick = notificationsViewModel::openSheet) {
                            Icon(Icons.Default.Notifications, contentDescription = "Уведомления")
                        }
                    }
                },
            )
        },
    ) { padding ->
        HomeScreen(
            modifier = Modifier.padding(padding),
            hasActiveCampaign = state.hasActiveCampaign,
            onModeSelected = { mode ->
                workViewModel.setMode(mode)
                onModeSelected(mode)
            },
        )
    }

    if (state.isSheetOpen) {
        ModalBottomSheet(
            onDismissRequest = notificationsViewModel::closeSheet,
            sheetState = sheetState,
        ) {
            NotificationsSheet(
                isLoading = state.isLoading,
                notifications = state.notifications,
            )
        }
    }
}

@Composable
private fun NotificationsSheet(
    isLoading: Boolean,
    notifications: List<NotificationDto>,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .fillMaxHeight(0.6f),
    ) {
        Text(
            text = "Уведомления",
            style = MaterialTheme.typography.titleLarge,
            modifier = Modifier.padding(horizontal = 20.dp, vertical = 12.dp),
        )
        HorizontalDivider()
        when {
            isLoading -> Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center,
            ) {
                CircularProgressIndicator()
            }
            notifications.isEmpty() -> Text(
                text = "Нет уведомлений",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp),
            )
            else -> LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                items(notifications, key = { it.id }) { notification ->
                    NotificationCard(notification)
                }
            }
        }
    }
}

@Composable
private fun NotificationCard(notification: NotificationDto) {
    val isOpen = notification.type == "CAMPAIGN_OPEN"
    val typeColor = if (isOpen) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error
    val typeLabel = if (isOpen) "Кампания открыта" else "Кампания закрыта"
    val time = runCatching {
        val raw = notification.createdAt
        "${raw.substring(0, 10)} ${raw.substring(11, 16)}"
    }.getOrElse { notification.createdAt }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = typeLabel,
                    style = MaterialTheme.typography.labelMedium,
                    color = typeColor,
                )
                Text(
                    text = time,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            Text(
                text = notification.campaignTitle,
                style = MaterialTheme.typography.bodyMedium,
            )
            if (!notification.description.isNullOrBlank()) {
                Text(
                    text = notification.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}
