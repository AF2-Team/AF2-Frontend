package com.dev.af2.features.auth.data

import com.dev.af2.core.network.NetworkModule
import com.dev.af2.core.network.TokenManager
import io.ktor.client.request.delete
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.http.isSuccess

class FavoriteRepository {
    private val client = NetworkModule.client

    // Asumimos que la ruta es social/favorite/{postId}
    // Si tu backend usa "favorites" (plural) o una ruta distinta, ajústalo aquí.

    suspend fun addFavorite(postId: String): Result<Boolean> {
        return try {
            val token = TokenManager.token ?: throw Exception("No autenticado")
            val response = client.post("social/favorite/posts/$postId") {
                header("Authorization", "Bearer $token")
            }
            if (response.status.isSuccess()) Result.success(true)
            else Result.failure(Exception("Error add favorite: ${response.status}"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun removeFavorite(postId: String): Result<Boolean> {
        return try {
            val token = TokenManager.token ?: throw Exception("No autenticado")
            val response = client.delete("social/favorite/posts/$postId") {
                header("Authorization", "Bearer $token")
            }
            if (response.status.isSuccess()) Result.success(true)
            else Result.failure(Exception("Error remove favorite: ${response.status}"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}