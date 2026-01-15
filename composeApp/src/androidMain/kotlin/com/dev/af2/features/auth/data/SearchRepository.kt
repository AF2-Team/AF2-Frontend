package com.dev.af2.features.auth.data


import com.dev.af2.core.network.NetworkModule
import com.dev.af2.core.network.TokenManager
import com.dev.af2.features.auth.data.remote.BaseResponse
import com.dev.af2.features.auth.data.remote.User
import com.dev.af2.features.auth.domain.Post
import com.dev.af2.features.auth.domain.SearchGlobalResponse
import com.dev.af2.features.auth.domain.Tag
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.parameter

class SearchRepository {
    private val client = NetworkModule.client

    // Búsqueda Global (Todo)
    suspend fun searchAll(query: String): Result<SearchGlobalResponse> {
        return performSearch("", query)
    }

    // Búsqueda específica de Usuarios
    suspend fun searchUsers(query: String): Result<List<User>> {
        return performSearch("users", query) // devuelve lista directa en data
    }

    // Búsqueda específica de Posts
    suspend fun searchPosts(query: String): Result<List<Post>> {
        return performSearch("posts", query)
    }

    // Búsqueda específica de Tags
    suspend fun searchTags(query: String): Result<List<Tag>> {
        return performSearch("tags", query)
    }

    // Función genérica para no repetir código
    private suspend inline fun <reified T> performSearch(endpointSuffix: String, query: String): Result<T> {
        return try {
            val token = TokenManager.token
            // Construimos la URL: /api/v1/search o /api/v1/search/users, etc.
            val path = if (endpointSuffix.isEmpty()) "search" else "search/$endpointSuffix"

            val response = client.get(path) {
                header("Authorization", "Bearer $token")
                parameter("q", query) // Tu backend espera 'q' o 'query' según api-query.type.ts
            }

            if (response.status.value in 200..299) {
                val wrapper = response.body<BaseResponse<T>>()
                Result.success(wrapper.data)
            } else {
                Result.failure(Exception("Error ${response.status.value}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

