package com.github.arseniji.barcodescanner.di

import com.github.arseniji.barcodescanner.network.provideApi
import com.github.arseniji.barcodescanner.network.provideOkHttpClient
import com.github.arseniji.barcodescanner.network.provideRetrofit
import com.github.arseniji.barcodescanner.repository.AuthRepository
import com.github.arseniji.barcodescanner.repository.NotificationsRepository
import com.github.arseniji.barcodescanner.repository.ProductRepository
import com.github.arseniji.barcodescanner.repository.SessionRepository
import com.github.arseniji.barcodescanner.repository.SettingsRepository
import com.github.arseniji.barcodescanner.util.AudioHelper
import com.github.arseniji.barcodescanner.util.VibrationHelper
import com.github.arseniji.barcodescanner.viewModel.AuthViewModel
import com.github.arseniji.barcodescanner.viewModel.NotificationsViewModel
import com.github.arseniji.barcodescanner.viewModel.ProfileViewModel
import com.github.arseniji.barcodescanner.viewModel.ScannerViewModel
import com.github.arseniji.barcodescanner.viewModel.SettingsViewModel
import com.github.arseniji.barcodescanner.viewModel.StatsViewModel
import com.github.arseniji.barcodescanner.viewModel.WorkViewModel
import org.koin.android.ext.koin.androidContext
import org.koin.core.module.dsl.viewModelOf
import org.koin.dsl.module

val appModule = module {
    single { SettingsRepository(androidContext()) }
    single { AuthRepository(androidContext(), get()) }


    single { provideOkHttpClient(androidContext()) }
    single { provideRetrofit(get()) }
    single { provideApi(get()) }

    single { ProductRepository(get()) }
    single { SessionRepository(get()) }
    single { NotificationsRepository(get()) }

    single { AudioHelper(androidContext()) }
    single { VibrationHelper(androidContext()) }

    viewModelOf(::AuthViewModel)
    viewModelOf(::ProfileViewModel)
    viewModelOf(::ScannerViewModel)
    viewModelOf(::SettingsViewModel)
    viewModelOf(::WorkViewModel)
    viewModelOf(::StatsViewModel)
    viewModelOf(::NotificationsViewModel)
}