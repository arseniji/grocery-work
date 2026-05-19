package com.github.arseniji.barcodescanner.repository

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.github.arseniji.barcodescanner.model.ScanMode
import com.github.arseniji.barcodescanner.model.ScannedItem
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private val Context.draftDataStore by preferencesDataStore(name = "draft_session")

class DraftSessionRepository(private val context: Context) {

    private val dataStore = context.draftDataStore
    private val gson = Gson()

    companion object {
        private val ITEMS_KEY = stringPreferencesKey("items")
        private val MODE_KEY = stringPreferencesKey("mode")
    }

    val draftItems: Flow<List<ScannedItem>> = dataStore.data.map { prefs ->
        val json = prefs[ITEMS_KEY] ?: return@map emptyList()
        try {
            val type = object : TypeToken<List<ScannedItem>>() {}.type
            gson.fromJson(json, type) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    val draftMode: Flow<ScanMode?> = dataStore.data.map { prefs ->
        prefs[MODE_KEY]?.let { runCatching { ScanMode.valueOf(it) }.getOrNull() }
    }

    suspend fun saveDraft(items: List<ScannedItem>, mode: ScanMode) {
        dataStore.edit { prefs ->
            prefs[ITEMS_KEY] = gson.toJson(items)
            prefs[MODE_KEY] = mode.name
        }
    }

    suspend fun clearDraft() {
        dataStore.edit { it.clear() }
    }

    suspend fun loadDraft(): Pair<List<ScannedItem>, ScanMode?> {
        val items = draftItems.first()
        val mode = draftMode.first()
        return items to mode
    }
}
