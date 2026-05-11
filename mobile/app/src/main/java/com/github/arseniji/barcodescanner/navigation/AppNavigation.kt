package com.github.arseniji.barcodescanner.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.github.arseniji.barcodescanner.model.auth.AuthUiEffect
import com.github.arseniji.barcodescanner.repository.AuthRepository
import com.github.arseniji.barcodescanner.ui.screens.AuthScreen
import com.github.arseniji.barcodescanner.viewModel.AuthViewModel
import org.koin.androidx.compose.koinViewModel
import org.koin.compose.koinInject

@Composable
fun AppNavigation() {
    val rootNavController = rememberNavController()
    val authRepository: AuthRepository = koinInject()
    val isLoggedIn by authRepository.isLoggedIn.collectAsStateWithLifecycle(initialValue = true)

    LaunchedEffect(isLoggedIn) {
        if (!isLoggedIn) {
            rootNavController.navigate(Routes.AUTH) {
                popUpTo(0) { inclusive = true }
            }
        }
    }

    NavHost(navController = rootNavController, startDestination = Routes.AUTH) {
        composable(Routes.AUTH) {
            val viewModel: AuthViewModel = koinViewModel()
            val state by viewModel.state.collectAsStateWithLifecycle()
            LaunchedEffect(Unit) {
                viewModel.effect.collect { effect ->
                    when (effect) {
                        AuthUiEffect.NavigateToHome -> {
                            rootNavController.navigate(Routes.MAIN) {
                                popUpTo(Routes.AUTH) { inclusive = true }
                            }
                        }
                    }
                }
            }
            AuthScreen(state = state, onEvent = viewModel::onEvent)
        }

        composable(Routes.MAIN) {
            MainScreen(
                rootNavController = rootNavController,
                onLogout = {
                    rootNavController.navigate(Routes.AUTH) {
                        popUpTo(Routes.MAIN) { inclusive = true }
                    }
                },
            )
        }
    }
}