package com.dev.af2.features.auth.data
import com.dev.af2.core.network.NetworkModule
import com.dev.af2.core.network.TokenManager
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.http.isSuccess

class FollowRepository {
    private val client = NetworkModule.client

    // Esta función sirve para Seguir Y Dejar de seguir (Toggle)
    suspend fun toggleFollow(userId: String): Result<Boolean> {
        return try {
            val token = TokenManager.token ?: throw Exception("No autenticado")

            // Asumiendo que tu ruta backend es: POST /api/v1/social/follow/{userId}
            val response = client.post("social/follow/$userId") {
                header("Authorization", "Bearer $token")
            }

            if (response.status.isSuccess()) {
                Result.success(true)
            } else {
                Result.failure(Exception("Error al seguir usuario: ${response.status}"))
            }
        } catch (e: Exception) {
            e.printStackTrace()
            Result.failure(e)
        }
    }
}
