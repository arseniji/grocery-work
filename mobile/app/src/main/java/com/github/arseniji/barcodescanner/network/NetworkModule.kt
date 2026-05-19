package com.github.arseniji.barcodescanner.network

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import com.github.arseniji.barcodescanner.BuildConfig
import com.github.arseniji.barcodescanner.network.api.BarcodeScannerApi
import com.github.arseniji.barcodescanner.network.response.LoginResponse
import com.github.arseniji.barcodescanner.repository.authDataStore
import com.google.gson.Gson
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import okhttp3.Interceptor
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

private const val BASE_URL = "http://192.168.0.101:8080/"

private sealed class RefreshOutcome {
    data class Success(val tokens: LoginResponse) : RefreshOutcome()
    object AuthFailed : RefreshOutcome()
    object Transient : RefreshOutcome()
}

class AuthInterceptor(private val context: Context) : Interceptor {
    private val dataStore = context.authDataStore
    private val refreshMutex = Mutex()

    override fun intercept(chain: Interceptor.Chain): Response {
        val accessToken = runBlocking {
            dataStore.data.map { it[ACCESS_TOKEN_KEY] }.first()
        }

        val initialRequest = chain.request().newBuilder()
            .apply { if (!accessToken.isNullOrBlank()) addHeader("Authorization", "Bearer $accessToken") }
            .build()

        val response = chain.proceed(initialRequest)

        // 401 — стандарт, 403 — Spring Security по умолчанию для неаутентифицированных
        val needsRefresh = response.code == 401 || response.code == 403
        if (!needsRefresh || accessToken.isNullOrBlank()) return response

        response.close()

        val newAccessToken = runBlocking { refreshOrReuse(accessToken) } ?: return chain.proceed(initialRequest)

        val retryRequest = chain.request().newBuilder()
            .addHeader("Authorization", "Bearer $newAccessToken")
            .build()
        return chain.proceed(retryRequest)
    }

    // single-flight: только один поток фактически делает refresh,
    // остальные подхватывают уже обновлённый токен из DataStore
    private suspend fun refreshOrReuse(staleAccessToken: String): String? = refreshMutex.withLock {
        val currentAccess = dataStore.data.map { it[ACCESS_TOKEN_KEY] }.first()
        if (!currentAccess.isNullOrBlank() && currentAccess != staleAccessToken) {
            return@withLock currentAccess
        }

        val refreshToken = dataStore.data.map { it[REFRESH_TOKEN_KEY] }.first()
        if (refreshToken.isNullOrBlank()) return@withLock null

        when (val result = tryRefresh(refreshToken)) {
            is RefreshOutcome.Success -> {
                dataStore.edit { prefs ->
                    prefs[ACCESS_TOKEN_KEY] = result.tokens.accessToken
                    prefs[REFRESH_TOKEN_KEY] = result.tokens.refreshToken
                }
                result.tokens.accessToken
            }
            RefreshOutcome.AuthFailed -> {
                // refresh-токен реально невалиден или истёк — выходим
                dataStore.edit { it.clear() }
                null
            }
            RefreshOutcome.Transient -> {
                // сетевая ошибка / 5xx — не разлогиниваем, пусть пробуют позже
                null
            }
        }
    }

    private fun tryRefresh(refreshToken: String): RefreshOutcome {
        val client = OkHttpClient()
        val body = """{"refreshToken":"$refreshToken"}"""
            .toRequestBody("application/json".toMediaType())
        val request = Request.Builder()
            .url("${BASE_URL}api/v1/auth/refresh")
            .post(body)
            .build()
        return try {
            client.newCall(request).execute().use { response ->
                when {
                    response.isSuccessful -> {
                        val json = response.body?.string()
                        if (json.isNullOrBlank()) return RefreshOutcome.Transient
                        val tokens = runCatching { Gson().fromJson(json, LoginResponse::class.java) }.getOrNull()
                        if (tokens?.accessToken.isNullOrBlank() || tokens?.refreshToken.isNullOrBlank()) {
                            RefreshOutcome.Transient
                        } else {
                            RefreshOutcome.Success(tokens!!)
                        }
                    }
                    response.code == 401 || response.code == 403 -> RefreshOutcome.AuthFailed
                    else -> RefreshOutcome.Transient
                }
            }
        } catch (e: Exception) {
            RefreshOutcome.Transient
        }
    }

    companion object {
        val ACCESS_TOKEN_KEY = stringPreferencesKey("access_token")
        val REFRESH_TOKEN_KEY = stringPreferencesKey("refresh_token")
    }
}

fun provideOkHttpClient(context: Context): OkHttpClient {
    val builder = OkHttpClient.Builder()
        .addInterceptor(AuthInterceptor(context))
    if (BuildConfig.DEBUG) {
        builder.addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
    }
    return builder.build()
}

fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit =
    Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

fun provideApi(retrofit: Retrofit): BarcodeScannerApi =
    retrofit.create(BarcodeScannerApi::class.java)
