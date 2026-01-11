package com.dev.af2.features.auth.data


import androidx.compose.runtime.mutableStateListOf
import com.dev.af2.features.auth.domain.Post
import com.dev.af2.core.network.NetworkModule
import com.dev.af2.core.network.TokenManager
import com.dev.af2.features.auth.data.remote.BaseResponse
import io.ktor.client.call.body
import io.ktor.client.request.forms.formData
import io.ktor.client.request.forms.submitFormWithBinaryData
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.statement.HttpResponse
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.http.isSuccess

class PostRepository {
    private val client = NetworkModule.client

    // Recibe el texto y una lista de imágenes en Bytes (ByteArray)
    suspend fun createPost(content: String, imagesBytes: List<ByteArray>): Result<Post> {
        return try {
            val token = TokenManager.token ?: throw Exception("No estás logueado")

            // Endpoint del backend: POST /api/v1/posts
            val response = client.submitFormWithBinaryData(
                url = "post",
                formData = formData {
                    // 1. Enviamos el texto
                    append("content", content)

                    // 2. Enviamos las imágenes ( backend espera el campo "images")
                    imagesBytes.forEachIndexed { index, bytes ->
                        append("media", bytes, Headers.build {
                            append(HttpHeaders.ContentType, "image/jpeg") // Asumimos JPEG
                            append(HttpHeaders.ContentDisposition, "filename=\"image_$index.jpg\"")
                        })
                    }
                }
            ) {
                // 3. ¡CRUCIAL! Enviamos el Token en la cabecera
                header("Authorization", "Bearer $token")
            }

            if (response.status.isSuccess()) {
                val wrapper = response.body<BaseResponse<Post>>()
                Result.success(wrapper.data)
            } else {
                Result.failure(Exception("Error al crear post: ${response.status}"))
            }
        } catch (e: Exception) {
            println("DEBUG_POST: Error: ${e.message}")
            Result.failure(e)
        }
    }
    suspend fun getPosts(): Result<List<Post>> {
        return try {
            val token = TokenManager.token

            // Si no hay token, quizás no deberíamos permitir ver el feed,
            // pero por ahora lo dejamos opcional o lanzamos error.

            val response: HttpResponse = client.get("post") { // Asumiendo ruta GET /api/v1/posts
                if (token != null) {
                    header("Authorization", "Bearer $token")
                }
            }

            if (response.status.isSuccess()) {
                // Desempaquetamos la respuesta del backend
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
}