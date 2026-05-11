package com.github.arseniji.barcodescanner.model.stats

import com.github.arseniji.barcodescanner.network.dto.SessionDto
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.temporal.TemporalAdjusters

data class StatsUiState(
    val isLoading: Boolean = true,
    val error: String? = null,
    val sessions: List<SessionDto> = emptyList(),
    val weekOffset: Int = 0,
    val selectedDay: LocalDate? = null,
    val registrationDate: LocalDate? = null,
) {
    private val today: LocalDate get() = LocalDate.now()

    val minWeekStart: LocalDate get() = registrationDate
        ?.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        ?: today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))

    val currentWeekStart: LocalDate get() = today
        .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        .plusWeeks(weekOffset.toLong())

    val canGoBack: Boolean get() = currentWeekStart > minWeekStart
    val canGoForward: Boolean get() = weekOffset < 0

    val todayCount: Int get() = sessions.sumOf { session ->
        if (session.localDate() == today) session.items?.sumOf { it.quantity } ?: 0 else 0
    }

    val weekCount: Int get() {
        val weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        val weekEnd = weekStart.plusDays(6)
        return sessions.sumOf { session ->
            val d = session.localDate() ?: return@sumOf 0
            if (!d.isBefore(weekStart) && !d.isAfter(weekEnd))
                session.items?.sumOf { it.quantity } ?: 0
            else 0
        }
    }

    val weekDays: List<DayBar> get() {
        val countsByDate = sessions
            .groupBy { it.localDate() }
            .mapValues { (_, list) -> list.sumOf { it.items?.sumOf { i -> i.quantity } ?: 0 } }

        val bars = (0..6).map { offset ->
            val date = currentWeekStart.plusDays(offset.toLong())
            DayBar(
                date = date,
                itemCount = countsByDate[date] ?: 0,
                isGrayed = registrationDate != null && date < registrationDate,
                isToday = date == today,
                isFuture = date > today,
                heightFraction = 0f,
            )
        }

        val maxCount = bars
            .filter { !it.isGrayed && !it.isFuture }
            .maxOfOrNull { it.itemCount }
            ?.takeIf { it > 0 } ?: 1

        return bars.map { it.copy(heightFraction = it.itemCount.toFloat() / maxCount) }
    }

    val selectedDaySessions: List<SessionDto> get() = sessions
        .filter { it.localDate() == selectedDay }
        .sortedByDescending { it.createdAt }
}

data class DayBar(
    val date: LocalDate,
    val itemCount: Int,
    val isGrayed: Boolean,
    val isToday: Boolean,
    val isFuture: Boolean,
    val heightFraction: Float,
)

fun SessionDto.localDate(): LocalDate? = runCatching {
    LocalDate.parse(createdAt.take(10))
}.getOrNull()
