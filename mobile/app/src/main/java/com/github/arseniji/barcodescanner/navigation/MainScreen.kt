package com.github.arseniji.barcodescanner.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Work
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import com.github.arseniji.barcodescanner.model.ScanMode
import com.github.arseniji.barcodescanner.ui.screens.*
import com.github.arseniji.barcodescanner.viewModel.SettingsViewModel
import com.github.arseniji.barcodescanner.viewModel.WorkViewModel
import org.koin.androidx.compose.koinViewModel
import org.koin.core.annotation.KoinExperimentalAPI

@OptIn(KoinExperimentalAPI::class)
@Composable
fun MainScreen(
    rootNavController: NavController,
    onLogout: () -> Unit,
) {
    val mainNavController = rememberNavController()
    val navBackStackEntry by mainNavController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    val bottomNavItems = listOf(
        BottomNavItem("Работа", Icons.Default.Work, Routes.WORK),
        BottomNavItem("Профиль", Icons.Default.Person, Routes.PROFILE),
        BottomNavItem("Статистика", Icons.Default.BarChart, Routes.STATS),
        BottomNavItem("Настройки", Icons.Default.Settings, Routes.SETTINGS),
    )

    Scaffold(
        bottomBar = {
            NavigationBar {
                bottomNavItems.forEach { item ->
                    NavigationBarItem(
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label) },
                        selected = currentDestination?.hierarchy?.any { it.route == item.route } == true,
                        onClick = {
                            mainNavController.navigate(item.route) {
                                popUpTo(mainNavController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                    )
                }
            }
        },
    ) { innerPadding ->
        NavHost(
            navController = mainNavController,
            startDestination = Routes.WORK,
            modifier = Modifier.padding(innerPadding),
        ) {
            navigation(startDestination = Routes.WORK_HOME, route = Routes.WORK) {
                composable(Routes.WORK_HOME) { backStackEntry ->
                    val parentEntry = remember(backStackEntry) {
                        mainNavController.getBackStackEntry(Routes.WORK)
                    }
                    val workViewModel: WorkViewModel = koinViewModel(viewModelStoreOwner = parentEntry)
                    WorkHomeScreen(
                        onModeSelected = { mode ->
                            mainNavController.navigate(Routes.scannerRoute(mode))
                        },
                        workViewModel = workViewModel,
                    )
                }

                composable(
                    route = Routes.WORK_SCANNER,
                    arguments = listOf(navArgument("mode") { type = NavType.StringType }),
                ) { backStackEntry ->
                    val parentEntry = remember(backStackEntry) {
                        mainNavController.getBackStackEntry(Routes.WORK)
                    }
                    val workViewModel: WorkViewModel = koinViewModel(viewModelStoreOwner = parentEntry)
                    val mode = backStackEntry.arguments?.getString("mode")
                        ?.let { runCatching { ScanMode.valueOf(it) }.getOrNull() }
                        ?: ScanMode.RECEIVE

                    WorkScannerScreen(
                        mode = mode,
                        workViewModel = workViewModel,
                        onFinishedScanning = { mainNavController.navigate(Routes.WORK_SUMMARY) },
                        onBack = { mainNavController.popBackStack() },
                    )
                }

                composable(Routes.WORK_SUMMARY) { backStackEntry ->
                    val parentEntry = remember(backStackEntry) {
                        mainNavController.getBackStackEntry(Routes.WORK)
                    }
                    val workViewModel: WorkViewModel = koinViewModel(viewModelStoreOwner = parentEntry)
                    val workState by workViewModel.state.collectAsStateWithLifecycle()
                    WorkSummaryScreen(
                        workViewModel = workViewModel,
                        onDone = {
                            mainNavController.navigate(Routes.WORK_HOME) {
                                popUpTo(Routes.WORK) { inclusive = true }
                            }
                        },
                        onCancel = {
                            mainNavController.navigate(Routes.WORK_HOME) {
                                popUpTo(Routes.WORK) { inclusive = true }
                            }
                        },
                        onContinueScanning = {
                            mainNavController.navigate(Routes.scannerRoute(workState.mode)) {
                                popUpTo(Routes.WORK_SUMMARY) { inclusive = true }
                            }
                        },
                    )
                }
            }

            composable(Routes.PROFILE) {
                ProfileScreen(onNavigateToAuth = onLogout)
            }

            composable(Routes.STATS) {
                StatsScreen()
            }

            composable(Routes.SETTINGS) {
                val settingsViewModel: SettingsViewModel = koinViewModel()
                val state by settingsViewModel.state.collectAsStateWithLifecycle()
                SettingsScreen(
                    state = state,
                    onEvent = settingsViewModel::onEvent,
                    effectFlow = settingsViewModel.effect,
                    onBack = { mainNavController.popBackStack() },
                )
            }
        }
    }
}