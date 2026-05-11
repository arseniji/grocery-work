package com.github.arseniji.barcodescanner.repository

import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import okio.IOException

val Context.settingsDataStore by preferencesDataStore(name = "settings_prefs")

class SettingsRepository(private val context: Context) {

    companion object {
        private val VIBRATION_KEY = booleanPreferencesKey("vibration_enabled")
        private val SOUND_KEY = booleanPreferencesKey("sound_enabled")
    }

    private val dataStore = context.settingsDataStore

    val isVibrationEnabled: Flow<Boolean> = dataStore.data
        .catch { if (it is IOException) emit(emptyPreferences()) else throw it }
        .map { it[VIBRATION_KEY] ?: true }

    val isSoundEnabled: Flow<Boolean> = dataStore.data
        .catch { if (it is IOException) emit(emptyPreferences()) else throw it }
        .map { it[SOUND_KEY] ?: true }


    suspend fun setVibration(enabled: Boolean) {
        dataStore.edit { it[VIBRATION_KEY] = enabled }
    }

    suspend fun setSound(enabled: Boolean) {
        dataStore.edit { it[SOUND_KEY] = enabled }
    }

}