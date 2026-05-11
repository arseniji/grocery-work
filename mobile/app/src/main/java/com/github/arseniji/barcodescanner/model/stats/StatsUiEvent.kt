package com.github.arseniji.barcodescanner.model.stats

import java.time.LocalDate

sealed class StatsUiEvent {
    data object PreviousWeek : StatsUiEvent()
    data object NextWeek : StatsUiEvent()
    data class SelectDay(val date: LocalDate) : StatsUiEvent()
    data object DismissDay : StatsUiEvent()
}
