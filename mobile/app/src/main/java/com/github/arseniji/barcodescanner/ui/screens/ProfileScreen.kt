package com.github.arseniji.barcodescanner.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.github.arseniji.barcodescanner.model.profile.ProfileUiEffect
import com.github.arseniji.barcodescanner.model.profile.ProfileUiEvent
import com.github.arseniji.barcodescanner.model.profile.ProfileUiState
import com.github.arseniji.barcodescanner.viewModel.ProfileViewModel
import kotlinx.coroutines.flow.Flow
import org.koin.androidx.compose.koinViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    onNavigateToAuth: () -> Unit,
) {
    val viewModel: ProfileViewModel = koinViewModel()
    val state by viewModel.state.collectAsStateWithLifecycle()
    var showLogoutDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                ProfileUiEffect.ShowLogoutDialog -> showLogoutDialog = true
                ProfileUiEffect.NavigateToAuth -> onNavigateToAuth()
                is ProfileUiEffect.ShowError -> { /* snackbar если понадобится */ }
            }
        }
    }

    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = {
                showLogoutDialog = false
                viewModel.onEvent(ProfileUiEvent.LogoutDismissed)
            },
            title = { Text("Выход") },
            text = { Text("Вы уверены, что хотите выйти?") },
            confirmButton = {
                TextButton(onClick = {
                    showLogoutDialog = false
                    viewModel.onEvent(ProfileUiEvent.LogoutConfirmed)
                }) { Text("Выйти") }
            },
            dismissButton = {
                TextButton(onClick = {
                    showLogoutDialog = false
                    viewModel.onEvent(ProfileUiEvent.LogoutDismissed)
                }) { Text("Отмена") }
            },
        )
    }

    Scaffold(
        topBar = { TopAppBar(title = { Text("Профиль") }) },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Spacer(Modifier.height(24.dp))

            Icon(
                imageVector = Icons.Default.AccountCircle,
                contentDescription = null,
                modifier = Modifier.size(96.dp),
                tint = MaterialTheme.colorScheme.primary,
            )

            Text(state.name, style = MaterialTheme.typography.headlineSmall)
            Text(
                "Зарегистрирован: ${state.regDate}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )

            Spacer(Modifier.weight(1f))

            OutlinedButton(
                onClick = { viewModel.onEvent(ProfileUiEvent.LogoutCLicked) },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.outlinedButtonColors(
                    contentColor = MaterialTheme.colorScheme.error,
                ),
            ) {
                Icon(Icons.Default.Logout, contentDescription = null)
                Spacer(Modifier.width(8.dp))
                Text("Выйти из аккаунта")
            }
        }
    }
}