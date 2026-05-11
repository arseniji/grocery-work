package com.github.arseniji.barcodescanner.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.github.arseniji.barcodescanner.model.settings.SettingsUiEffect
import com.github.arseniji.barcodescanner.model.settings.SettingsUiEvent
import com.github.arseniji.barcodescanner.model.settings.SettingsUiState
import com.github.arseniji.barcodescanner.ui.components.SettingsToggleRow
import kotlinx.coroutines.flow.Flow

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    state: SettingsUiState,
    onEvent: (SettingsUiEvent) -> Unit,
    onBack: () -> Unit,
    effectFlow: Flow<SettingsUiEffect>,
) {
    val focusManager = LocalFocusManager.current
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(Unit) {
        effectFlow.collect { effect ->
            when (effect) {
                SettingsUiEffect.ShowSavedConf ->
                    snackbarHostState.showSnackbar("Настройки сохранены", duration = SnackbarDuration.Short)
            }
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        topBar = {
            TopAppBar(
                title = { Text("Настройки") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Назад")
                    }
                },
            )
        },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Spacer(Modifier.height(8.dp))

            Text(
                text = "Сканер",
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.padding(vertical = 4.dp),
            )

            SettingsToggleRow(
                title = "Вибрация при сканировании",
                checked = state.isVibrationEnabled,
                onCheckedChange = { onEvent(SettingsUiEvent.ToggleVibration(it)) },
            )
            HorizontalDivider()
            SettingsToggleRow(
                title = "Звук при сканировании",
                checked = state.isSoundEnabled,
                onCheckedChange = { onEvent(SettingsUiEvent.ToggleSound(it)) },
            )
            HorizontalDivider()

            Spacer(Modifier.height(8.dp))

        }
    }
}