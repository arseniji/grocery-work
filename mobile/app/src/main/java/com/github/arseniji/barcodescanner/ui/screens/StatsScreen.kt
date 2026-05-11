package com.github.arseniji.barcodescanner.ui.screens

import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.LifecycleEventEffect
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.github.arseniji.barcodescanner.model.stats.DayBar
import com.github.arseniji.barcodescanner.model.stats.StatsUiEvent
import com.github.arseniji.barcodescanner.model.stats.StatsUiState
import com.github.arseniji.barcodescanner.network.dto.SessionDto
import com.github.arseniji.barcodescanner.viewModel.StatsViewModel
import org.koin.androidx.compose.koinViewModel
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StatsScreen() {
    val viewModel: StatsViewModel = koinViewModel()
    val state by viewModel.state.collectAsStateWithLifecycle()
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    LifecycleEventEffect(Lifecycle.Event.ON_RESUME) {
        viewModel.retry()
    }

    Scaffold(
        topBar = { TopAppBar(title = { Text("Статистика") }) },
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
        ) {
            when {
                state.isLoading -> CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                state.error != null -> ErrorContent(
                    message = state.error!!,
                    onRetry = viewModel::retry,
                    modifier = Modifier.align(Alignment.Center),
                )
                else -> StatsContent(state = state, onEvent = viewModel::onEvent)
            }
        }
    }

    if (state.selectedDay != null) {
        ModalBottomSheet(
            onDismissRequest = { viewModel.onEvent(StatsUiEvent.DismissDay) },
            sheetState = sheetState,
        ) {
            DayDetailSheet(
                day = state.selectedDay!!,
                sessions = state.selectedDaySessions,
            )
        }
    }
}

@Composable
private fun StatsContent(
    state: StatsUiState,
    onEvent: (StatsUiEvent) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Spacer(Modifier.height(4.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            StatCard(label = "Сегодня", count = state.todayCount, modifier = Modifier.weight(1f))
            StatCard(label = "Эта неделя", count = state.weekCount, modifier = Modifier.weight(1f))
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            IconButton(
                onClick = { onEvent(StatsUiEvent.PreviousWeek) },
                enabled = state.canGoBack,
            ) {
                Icon(Icons.AutoMirrored.Filled.KeyboardArrowLeft, contentDescription = "Предыдущая неделя")
            }
            Text(
                text = weekLabel(state.currentWeekStart),
                style = MaterialTheme.typography.titleMedium,
                textAlign = TextAlign.Center,
                modifier = Modifier.weight(1f),
            )
            IconButton(
                onClick = { onEvent(StatsUiEvent.NextWeek) },
                enabled = state.canGoForward,
            ) {
                Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = "Следующая неделя")
            }
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp),
        ) {
            state.weekDays.forEach { day ->
                DayBarItem(
                    day = day,
                    onClick = {
                        if (!day.isGrayed && !day.isFuture) onEvent(StatsUiEvent.SelectDay(day.date))
                    },
                    modifier = Modifier.weight(1f),
                )
            }
        }
    }
}

@Composable
private fun StatCard(label: String, count: Int, modifier: Modifier = Modifier) {
    ElevatedCard(modifier = modifier) {
        Column(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = count.toString(),
                style = MaterialTheme.typography.displaySmall,
                color = MaterialTheme.colorScheme.primary,
            )
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

private val dayShortNames = listOf("Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс")

@Composable
private fun DayBarItem(day: DayBar, onClick: () -> Unit, modifier: Modifier = Modifier) {
    val isClickable = !day.isGrayed && !day.isFuture
    val barColor = when {
        day.isGrayed -> MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f)
        day.isToday -> MaterialTheme.colorScheme.primary
        day.itemCount > 0 -> MaterialTheme.colorScheme.primaryContainer
        else -> MaterialTheme.colorScheme.surfaceVariant
    }
    val labelColor = when {
        day.isGrayed -> MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
        day.isToday -> MaterialTheme.colorScheme.primary
        else -> MaterialTheme.colorScheme.onSurfaceVariant
    }

    Column(
        modifier = modifier
            .fillMaxHeight()
            .clip(RoundedCornerShape(8.dp))
            .clickable(enabled = isClickable, onClick = onClick)
            .padding(horizontal = 2.dp, vertical = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = if (!day.isGrayed && day.itemCount > 0) day.itemCount.toString() else "",
            style = MaterialTheme.typography.labelSmall,
            color = if (day.isToday) MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.onSurfaceVariant,
            maxLines = 1,
        )
        Spacer(Modifier.height(2.dp))

        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            contentAlignment = Alignment.BottomCenter,
        ) {
            val fraction = when {
                day.isGrayed || day.isFuture -> 0f
                day.heightFraction == 0f -> 0.04f
                else -> day.heightFraction.coerceAtLeast(0.06f)
            }
            if (fraction > 0f) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .fillMaxHeight(fraction)
                        .clip(RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp))
                        .background(barColor),
                )
            }
        }

        Spacer(Modifier.height(4.dp))
        Text(
            text = dayShortNames[day.date.dayOfWeek.value - 1],
            style = MaterialTheme.typography.labelSmall,
            color = labelColor,
        )
    }
}

@Composable
private fun DayDetailSheet(day: LocalDate, sessions: List<SessionDto>) {
    val ruLocale = Locale("ru")
    val headerFmt = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy", ruLocale)
    val totalItems = sessions.sumOf { it.items?.sumOf { i -> i.quantity } ?: 0 }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .fillMaxHeight(0.7f),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .padding(top = 4.dp, bottom = 12.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            Text(
                text = day.format(headerFmt).replaceFirstChar { it.uppercaseChar() },
                style = MaterialTheme.typography.titleLarge,
            )
            Text(
                text = "Товаров обработано: $totalItems",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        HorizontalDivider()
        if (sessions.isEmpty()) {
            Text(
                text = "В этот день нет активности",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp),
            )
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                items(sessions, key = { it.id }) { session -> SessionRow(session) }
            }
        }
    }
}

@Composable
private fun SessionRow(session: SessionDto) {
    var expanded by remember { mutableStateOf(false) }
    val itemCount = session.items?.sumOf { it.quantity } ?: 0
    val time = runCatching { session.createdAt.substring(11, 16) }.getOrElse { "" }
    val modeLabel = when (session.mode) {
        "RECEIVE" -> "Приём"
        "INVENTORY" -> "Инвентаризация"
        "WRITE_OFF" -> "Списание"
        else -> session.mode
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
    ) {
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { expanded = !expanded }
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(modeLabel, style = MaterialTheme.typography.bodyMedium)
                    Text(
                        text = time,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Text(
                    text = "$itemCount шт.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary,
                )
                Spacer(Modifier.width(4.dp))
                Icon(
                    imageVector = if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }

            if (expanded) {
                Column(
                    modifier = Modifier.padding(start = 12.dp, end = 12.dp, bottom = 10.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    HorizontalDivider(modifier = Modifier.padding(bottom = 4.dp))
                    val items = session.items.orEmpty()
                    if (items.isEmpty()) {
                        Text(
                            text = "Нет товаров",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    } else {
                        items.forEach { item ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                            ) {
                                Text(
                                    text = item.productName ?: item.barcode,
                                    style = MaterialTheme.typography.bodySmall,
                                    modifier = Modifier.weight(1f),
                                )
                                Text(
                                    text = "${item.quantity} шт.",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ErrorContent(message: String, onRetry: () -> Unit, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text(
            text = message,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.error,
            textAlign = TextAlign.Center,
        )
        OutlinedButton(onClick = onRetry) { Text("Повторить") }
    }
}

private fun weekLabel(start: LocalDate): String {
    val end = start.plusDays(6)
    val ru = Locale("ru")
    return if (start.month == end.month) {
        val d = DateTimeFormatter.ofPattern("d", ru)
        val m = DateTimeFormatter.ofPattern("MMMM yyyy", ru)
        "${start.format(d)}–${end.format(d)} ${end.format(m)}"
    } else {
        val fmt = DateTimeFormatter.ofPattern("d MMM", ru)
        "${start.format(fmt)} – ${end.format(fmt)} ${end.year}"
    }
}
