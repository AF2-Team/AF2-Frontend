package com.dev.af2.features.auth.data

import com.dev.af2.features.auth.domain.Post
import com.dev.af2.core.network.NetworkModule
import com.dev.af2.core.network.TokenManager
import com.dev.af2.features.auth.data.remote.BaseResponse
import com.dev.af2.features.auth.data.remote.LikeResponse
import com.dev.af2.features.auth.domain.Comment
import io.ktor.client.call.body
import io.ktor.client.request.forms.formData
import io.ktor.client.request.forms.submitFormWithBinaryData
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.http.contentType
import io.ktor.http.isSuccess

class PostRepository {
    private val client = NetworkModule.client

    suspend fun createPost(content: String, imagesBytes: List<ByteArray>): Result<Post> {
        println("🚨 [REPO] Iniciando createPost. Texto: '$content', Imgs: ${imagesBytes.size}")

        return try {
            // Verificación explícita del token para depuración
            val token = TokenManager.token
            if (token == null) {
                println("🚨 [REPO] ERROR CRÍTICO: Token es NULO. El usuario no parece estar logueado.")
                throw Exception("No estás logueado (Token null)")
            }
            println("🚨 [REPO] Token encontrado. Enviando petición a Ktor...")

            val response = client.submitFormWithBinaryData(
                url = "post", // Esto concatena con BASE_URL -> /api/v1/post
                formData = formData {
                    // CORRECCIÓN 1: Cambiamos "content" por "text"
                    append("text", content)

                    imagesBytes.forEachIndexed { index, bytes ->
                        append("media", bytes, Headers.build {
                            append(HttpHeaders.ContentType, "image/jpeg")
                            append(HttpHeaders.ContentDisposition, "filename=\"image_$index.jpg\"")
                        })
                    }
                }
            ) {
                header("Authorization", "Bearer $token")
            }

            println("🚨 [REPO] Respuesta recibida: ${response.status}")

            if (response.status.isSuccess()) {
                val wrapper = response.body<BaseResponse<Post>>()
                Result.success(wrapper.data)
            } else {
                // Leemos el cuerpo del error para saber qué dice el backend
                val errorBody = response.body<String>()
                println("🚨 [REPO] Error Backend: $errorBody")
                Result.failure(Exception("Error al crear post: ${response.status} -> $errorBody"))
            }
        } catch (e: Exception) {
            println("🚨 [REPO] EXCEPCIÓN: ${e.message}")
            e.printStackTrace()
            Result.failure(e)
        }
    }

    suspend fun getPosts(): Result<List<Post>> {
        return try {
            val token = TokenManager.token
            val response: HttpResponse = client.get("post") {
                if (token != null) {
                    header("Authorization", "Bearer $token")
                }
            }
            if (response.status.isSuccess()) {
                val wrapper = response.body<BaseResponse<List<Post>>>()
                Result.success(wrapper.data)
            } else {
                Result.failure(Exception("Error al obtener posts: ${response.status}"))
            }
        } catch (e: Exception) {
            println("DEBUG_REPO: Error getPosts: ${e.message}")
            Result.failure(e)
        }
    }

    suspend fun toggleLike(postId: String): Result<LikeResponse> {
        return try {
            val token = TokenManager.token ?: throw Exception("No autenticado")

            // Llamada POST a /api/v1/post/{id}/like
            val response = client.post("post/$postId/like") {
                header("Authorization", "Bearer $token")
            }

            if (response.status.isSuccess()) {
                val wrapper = response.body<BaseResponse<LikeResponse>>()
                Result.success(wrapper.data)
            } else {
                Result.failure(Exception("Error like: ${response.status}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createComment(postId: String, text: String): Result<Comment> {
        return try {
            val token = TokenManager.token
            val response = client.post("post/$postId/comment") { // Llamamos a la ruta que creamos en Post
                header("Authorization", "Bearer $token")
                contentType(ContentType.Application.Json)
                setBody(mapOf("text" to text))
            }
            if (response.status.isSuccess()) {
                val wrapper = response.body<BaseResponse<Comment>>()
                Result.success(wrapper.data)
            } else {
                Result.failure(Exception("Error comment: ${response.status}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Leer
    suspend fun getComments(postId: String): Result<List<Comment>> {
        return try {
            val token = TokenManager.token
            val response = client.get("post/$postId/comments") {
                header("Authorization", "Bearer $token")
            }
            if (response.status.isSuccess()) {
                val wrapper = response.body<BaseResponse<List<Comment>>>()
                Result.success(wrapper.data)
            } else {
                Result.failure(Exception("Error fetching comments"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}