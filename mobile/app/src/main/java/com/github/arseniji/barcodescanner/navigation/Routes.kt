package com.github.arseniji.barcodescanner.navigation

import com.github.arseniji.barcodescanner.model.ScanMode

object Routes {
    const val AUTH = "auth"
    const val MAIN = "main"

    const val WORK = "work"
    const val WORK_HOME = "work_home"
    const val WORK_SCANNER = "work_scanner/{mode}"
    const val WORK_SUMMARY = "work_summary"

    const val PROFILE = "profile"
    const val STATS = "stats"
    const val SETTINGS = "settings"

    fun scannerRoute(mode: ScanMode) = "work_scanner/$mode"
}