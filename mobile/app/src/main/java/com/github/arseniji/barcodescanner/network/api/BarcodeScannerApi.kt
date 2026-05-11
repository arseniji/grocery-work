package com.github.arseniji.barcodescanner.network.api

import com.github.arseniji.barcodescanner.network.dto.EmployeeDto
import com.github.arseniji.barcodescanner.network.dto.NotificationsResponseDto
import com.github.arseniji.barcodescanner.network.dto.ProductDto
import com.github.arseniji.barcodescanner.network.dto.SessionDto
import com.github.arseniji.barcodescanner.network.request.CreateSessionRequest
import com.github.arseniji.barcodescanner.network.request.LoginRequest
import com.github.arseniji.barcodescanner.network.request.RefreshRequest
import com.github.arseniji.barcodescanner.network.response.CreateSessionResponse
import com.github.arseniji.barcodescanner.network.response.LoginResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

interface BarcodeScannerApi {

    @POST("api/v1/auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @POST("api/v1/auth/refresh")
    suspend fun refresh(@Body request: RefreshRequest): LoginResponse

    @POST("api/v1/auth/logout")
    suspend fun logout(@Body request: RefreshRequest)

    @GET("api/v1/products/{barcode}")
    suspend fun getProduct(@Path("barcode") barcode: String): ProductDto

    @POST("api/v1/sessions")
    suspend fun createSession(@Body request: CreateSessionRequest)

    @GET("api/v1/sessions")
    suspend fun getSessions(): List<SessionDto>

    @GET("api/v1/sessions/{id}")
    suspend fun getSession(@Path("id") id: Int): SessionDto

    @GET("api/v1/employees/me")
    suspend fun getMe(): EmployeeDto

    @GET("api/v1/notifications")
    suspend fun getNotifications(): NotificationsResponseDto
}
