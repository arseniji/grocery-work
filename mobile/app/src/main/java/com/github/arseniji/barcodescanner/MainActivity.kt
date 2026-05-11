package com.github.arseniji.barcodescanner

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.github.arseniji.barcodescanner.navigation.AppNavigation
import com.github.arseniji.barcodescanner.ui.theme.BarcodeScannerTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            BarcodeScannerTheme {
                AppNavigation()
            }
        }
    }
}