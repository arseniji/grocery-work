package com.github.arseniji.barcodescanner.model

enum class ScanMode(val title: String) {
    RECEIVE("Приём товара"),
    INVENTORY("Инвентаризация"),
    WRITE_OFF("Списание")
}