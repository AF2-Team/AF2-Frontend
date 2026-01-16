package com.dev.af2.features.auth.data

import com.dev.af2.core.network.NetworkModule
import com.dev.af2.core.network.TokenManager
import io.ktor.client.request.delete
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.http.isSuccess

class FollowRepository {
    private val client = NetworkModule.client

    suspend fun followUser(userId: String): Result<Boolean> {
        return try {
            val token = TokenManager.token ?: throw Exception("No autenticado")
            // RUTA CORREGIDA: Agregamos /users/ según tu backend
            val response = client.post("social/follow/users/$userId") {
                header("Authorization", "Bearer $token")
            }
            if (response.status.isSuccess()) Result.success(true)
            else Result.failure(Exception("Error follow: ${response.status}"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun unfollowUser(userId: String): Result<Boolean> {
        return try {
            val token = TokenManager.token ?: throw Exception("No autenticado")
            // RUTA CORREGIDA: DELETE
            val response = client.delete("social/follow/users/$userId") {
                header("Authorization", "Bearer $token")
            }
            if (response.status.isSuccess()) Result.success(true)
            else Result.failure(Exception("Error unfollow: ${response.status}"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}