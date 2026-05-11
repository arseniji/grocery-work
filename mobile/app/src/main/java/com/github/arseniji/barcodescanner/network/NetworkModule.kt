package com.github.arseniji.barcodescanner.network

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import com.github.arseniji.barcodescanner.BuildConfig
import com.github.arseniji.barcodescanner.network.api.BarcodeScannerApi
import com.github.arseniji.barcodescanner.network.response.LoginResponse
import com.github.arseniji.barcodescanner.repository.AuthRepository
import com.github.arseniji.barcodescanner.repository.authDataStore
import com.google.gson.Gson
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class AuthInterceptor(private val context: Context) : Interceptor {
    private val dataStore = context.authDataStore

    override fun intercept(chain: Interceptor.Chain): Response {
        val accessToken = runBlocking {
            dataStore.data.map { it[ACCESS_TOKEN_KEY] }.first()
        }

        val originalRequest = chain.request().newBuilder()
            .apply { if (!accessToken.isNullOrBlank()) addHeader("Authorization", "Bearer $accessToken") }
            .build()

        val response = chain.proceed(originalRequest)

        // если не 401 — всё хорошо, возвращаем
        if (response.code != 401) return response

        // пробуем обновить токен
        val refreshToken = runBlocking {
            dataStore.data.map { it[REFRESH_TOKEN_KEY] }.first()
        }
        if (refreshToken.isNullOrBlank()) return response

        response.close()

        val newTokens = tryRefresh(refreshToken) ?: run {
            runBlocking { dataStore.edit { it.clear() } }
            return response
        }

        runBlocking {
            dataStore.edit { prefs ->
                prefs[ACCESS_TOKEN_KEY]  = newTokens.accessToken
                prefs[REFRESH_TOKEN_KEY] = newTokens.refreshToken
            }
        }

        // повторяем исходный запрос с новым токеном
        val retryRequest = chain.request().newBuilder()
            .addHeader("Authorization", "Bearer ${newTokens.accessToken}")
            .build()
        return chain.proceed(retryRequest)
    }

    // отдельный OkHttp без интерцептора чтобы не зациклиться
    private fun tryRefresh(refreshToken: String): LoginResponse? {
        val client = OkHttpClient()
        val body = """{"refreshToken":"$refreshToken"}"""
            .toRequestBody("application/json".toMediaType())
        val request = Request.Builder()
            .url("http://192.168.0.101:8080/api/v1/auth/refresh")
            .post(body)
            .build()
        return try {
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val json = response.body?.string() ?: return null
                Gson().fromJson(json, LoginResponse::class.java)
            } else null
        } catch (e: Exception) {
            null
        }
    }

    companion object {
        val ACCESS_TOKEN_KEY  = stringPreferencesKey("access_token")
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
        .baseUrl("http://192.168.0.101:8080/")
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

fun provideApi(retrofit: Retrofit): BarcodeScannerApi =
    retrofit.create(BarcodeScannerApi::class.java)