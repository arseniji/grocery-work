package com.github.arseniji.barcodescanner.repository

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.github.arseniji.barcodescanner.network.api.result.ApiResult
import com.github.arseniji.barcodescanner.network.api.BarcodeScannerApi
import com.github.arseniji.barcodescanner.network.api.result.safeApiCall
import com.github.arseniji.barcodescanner.network.request.LoginRequest
import com.github.arseniji.barcodescanner.network.request.RefreshRequest
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

val Context.authDataStore by preferencesDataStore(name = "auth_prefs")

class AuthRepository(
    private val context: Context,
    private val api: BarcodeScannerApi,
) {
    companion object {
        private val ACCESS_TOKEN_KEY = stringPreferencesKey("access_token")
        private val REFRESH_TOKEN_KEY = stringPreferencesKey("refresh_token")
        private val EMPLOYEE_ID_KEY = intPreferencesKey("employee_id")
        private val FIRSTNAME_KEY = stringPreferencesKey("firstname")
        private val LASTNAME_KEY = stringPreferencesKey("lastname")
        private val REGISTRATION_DATE_KEY = stringPreferencesKey("registration_date")
        private val LAST_SEEN_NOTIFICATION_KEY = intPreferencesKey("last_seen_notification_id")
    }

    private val dataStore = context.authDataStore

    val token: Flow<String?> = dataStore.data.map { it[ACCESS_TOKEN_KEY] }
    val refreshToken: Flow<String?> = dataStore.data.map { it[REFRESH_TOKEN_KEY] }
    val employeeId: Flow<Int?> = dataStore.data.map { it[EMPLOYEE_ID_KEY] }
    val firstname: Flow<String?> = dataStore.data.map { it[FIRSTNAME_KEY] }
    val lastname: Flow<String?> = dataStore.data.map { it[LASTNAME_KEY] }
    val registrationDate: Flow<String?> = dataStore.data.map { it[REGISTRATION_DATE_KEY] }
    val lastSeenNotificationId: Flow<Int> = dataStore.data.map { it[LAST_SEEN_NOTIFICATION_KEY] ?: 0 }

    val isLoggedIn: Flow<Boolean> = token.map { !it.isNullOrBlank() }

    suspend fun markNotificationsSeen(maxId: Int) {
        dataStore.edit { it[LAST_SEEN_NOTIFICATION_KEY] = maxId }
    }

    suspend fun login(login: String, password: String): ApiResult<Unit> {
        val result = safeApiCall { api.login(LoginRequest(login, password)) }
        if (result is ApiResult.Success) {
            dataStore.edit { prefs ->
                prefs[ACCESS_TOKEN_KEY] = result.data.accessToken
                prefs[REFRESH_TOKEN_KEY] = result.data.refreshToken
            }

            val meResult = safeApiCall { api.getMe() }
            if (meResult is ApiResult.Success) {
                dataStore.edit { prefs ->
                    prefs[EMPLOYEE_ID_KEY] = meResult.data.id
                    prefs[FIRSTNAME_KEY] = meResult.data.firstname
                    prefs[LASTNAME_KEY] = meResult.data.lastname
                    meResult.data.createdAt?.let { prefs[REGISTRATION_DATE_KEY] = it }
                }
            }
        }
        return result.map { }
    }

    suspend fun logout() {
        val rt = dataStore.data.map { it[REFRESH_TOKEN_KEY] }.first()
        if (!rt.isNullOrBlank()) {
            safeApiCall { api.logout(RefreshRequest(rt)) }
        }
        dataStore.edit { it.clear() }
    }
}

private fun <T> ApiResult<T>.map(transform: (T) -> Unit): ApiResult<Unit> = when (this) {
    is ApiResult.Success -> ApiResult.Success(transform(data))
    is ApiResult.Error -> this
}