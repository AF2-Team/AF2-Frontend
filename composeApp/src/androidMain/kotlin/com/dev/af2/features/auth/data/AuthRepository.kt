package com.dev.af2.features.auth.data

import com.dev.af2.core.network.NetworkModule
import com.dev.af2.core.network.TokenManager
import com.dev.af2.features.auth.data.remote.AuthResponse
import com.dev.af2.features.auth.data.remote.BackendErrorWrapper
import com.dev.af2.features.auth.data.remote.BaseResponse
import com.dev.af2.features.auth.data.remote.LoginRequest
import com.dev.af2.features.auth.data.remote.ProfileResponse
import com.dev.af2.features.auth.data.remote.RegisterRequest
import io.ktor.client.call.body
import io.ktor.client.request.header
import io.ktor.client.request.patch
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.client.request.get
import com.dev.af2.features.auth.data.remote.User
import com.dev.af2.features.auth.domain.UserProfileResponse
import io.ktor.client.request.forms.MultiPartFormDataContent
import io.ktor.client.request.forms.formData
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders

//Recordar borrar prints de depuración
class AuthRepository {
    private val client = NetworkModule.client

    suspend fun register(request: RegisterRequest): Result<AuthResponse> {
        println("DEBUG_REPO: 1. Iniciando petición en Repositorio")
        return try {
            val response: HttpResponse = client.post("auth/signup") {
                setBody(request)
            }

            println("DEBUG_REPO: 2. Respuesta recibida. Status: ${response.status}")

            if (response.status.isSuccess()) {

                val wrapper = response.body<BaseResponse<AuthResponse>>()

                println("DEBUG_REPO: 3. Éxito! Datos desempaquetados: ${wrapper.data.email}")

                Result.success(wrapper.data)
            } else {
                val errorMsg = try {
                    // 1. Leemos la estructura completa (Wrapper)
                    val errorWrapper = response.body<BackendErrorWrapper>()

                    // 2. Extraemos el mensaje del objeto 'error' interno
                    errorWrapper.error?.message ?: "Error desconocido del backend"

                } catch (e: Exception) {
                    println("DEBUG_REPO: Falló al leer el error JSON: ${e.message}")
                    // Si falla el parseo, devolvemos el código de estado como respaldo
                    "Error del servidor: ${response.status.value}"
                }

                println("DEBUG_REPO: Mensaje de error final extraído: '$errorMsg'")
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            println("DEBUG_REPO: ❌ EXCEPCIÓN: ${e.message}")
            e.printStackTrace()
            Result.failure(e)
        }
    }

    suspend fun login(request: LoginRequest): Result<AuthResponse> {
        return try {

            val response: HttpResponse = client.post("auth/login") {
                setBody(request)
            }

            if (response.status.isSuccess()) {
                val wrapper = response.body<BaseResponse<AuthResponse>>()
                Result.success(wrapper.data)
            } else {
                val errorMsg = try {
                    val errorWrapper = response.body<BackendErrorWrapper>()
                    errorWrapper.error?.message ?: "Credenciales inválidas"
                } catch (e: Exception) {
                    "Error del servidor: ${response.status.value}"
                }
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    suspend fun changePassword(currentPass: String, newPass: String): Result<Boolean> {
        return try {
            val token = TokenManager.token ?: throw Exception("No autenticado")

            val response = client.post("auth/change-password") {
                header("Authorization", "Bearer $token")
                contentType(ContentType.Application.Json)
                setBody(mapOf(
                    "currentPassword" to currentPass,
                    "newPassword" to newPass
                ))
            }

            if (response.status.isSuccess()) {
                Result.success(true)
            } else {
                // --- PARSEO INTELIGENTE DEL ERROR ---
                val errorMsg = try {
                    // Usamos la misma estructura que en Login/Register para extraer el mensaje limpio
                    val errorWrapper = response.body<BackendErrorWrapper>()
                    errorWrapper.error?.message ?: "Error desconocido"
                } catch (e: Exception) {
                    // Si falla el JSON, devolvemos el error HTTP estándar
                    "Error del servidor: ${response.status.value}"
                }
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            e.printStackTrace()
            Result.failure(e)
        }
    }

    suspend fun forgotPassword(email: String): Result<Boolean> {
        return try {
            val response = client.post("auth/forgot-password") {
                contentType(ContentType.Application.Json)
                setBody(mapOf("email" to email))
            }

            if (response.status.isSuccess()) {
                // El backend devuelve { "resetToken": "..." }
                // Por seguridad, en el front solo decimos "Enviado"
                Result.success(true)
            } else {
                val errorMsg = try {
                    val errorWrapper = response.body<BackendErrorWrapper>()
                    errorWrapper.error?.message ?: "Error desconocido"
                } catch (e: Exception) {
                    "Error del servidor: ${response.status.value}"
                }
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            e.printStackTrace()
            Result.failure(e)
        }
    }
    suspend fun getMe(): Result<User> {
        return try {
            val token = TokenManager.token ?: throw Exception("No autenticado")


            val response = client.get("user/me") {
                header("Authorization", "Bearer $token")
            }

            if (response.status.isSuccess()) {
                // AQUI EL CAMBIO: Leemos ProfileResponse, no User directo
                val wrapper = response.body<BaseResponse<ProfileResponse>>()

                // Combinamos los datos.
                // Como tu objeto User ya tiene campos followersCount/followingCount/postsCount,
                // podemos actualizarlos con lo que viene en 'stats' para que la UI los muestre.
                val profileData = wrapper.data
                val userWithStats = profileData.user.copy(
                    followersCount = profileData.stats?.followers ?: profileData.user.followersCount,
                    followingCount = profileData.stats?.following ?: profileData.user.followingCount,
                    postsCount = profileData.stats?.posts ?: profileData.user.postsCount
                )

                Result.success(userWithStats)
            } else {
                Result.failure(Exception("Error fetching profile"))
            }
        } catch (e: Exception) {
            println("DEBUG_REPO: Error getMe: ${e.message}")
            Result.failure(e)
        }
    }
    suspend fun getUserProfile(userId: String): Result<UserProfileResponse> {
        return try {
            val token = TokenManager.token
            val response = client.get("user/$userId") {
                header("Authorization", "Bearer $token")
            }

            if (response.status.isSuccess()) {
                // Deserializamos directamente la respuesta completa
                // (UserProfileResponse ya incluye success, message y data)
                val fullResponse = response.body<UserProfileResponse>()
                Result.success(fullResponse)
            } else {
                Result.failure(Exception("Error fetching profile: ${response.status}"))
            }
        } catch (e: Exception) {
            e.printStackTrace()
            Result.failure(e)
        }
    }
    suspend fun updateAvatar(imageBytes: ByteArray): Result<User> {
        return try {
            val token = TokenManager.token ?: throw Exception("No autenticado")

            // Ruta basada en tu backend: router.patch('/me/avatar', ...)
            val response = client.patch("user/me/avatar") {
                header("Authorization", "Bearer $token")
                setBody(
                    MultiPartFormDataContent(
                        formData {
                            append("media", imageBytes, Headers.build {
                                append(HttpHeaders.ContentType, "image/jpeg")
                                append(HttpHeaders.ContentDisposition, "filename=\"avatar.jpg\"")
                            })
                        }
                    )
                )
            }

            if (response.status.isSuccess()) {
                // Asumimos que el backend devuelve el usuario actualizado en 'data'
                // Reutilizamos ProfileResponse o AuthResponse según devuelva tu backend
                val wrapper = response.body<BaseResponse<User>>() // Ojo: verifica si devuelve User o AuthResponse
                Result.success(wrapper.data)
            } else {
                Result.failure(Exception("Error subiendo avatar: ${response.status}"))
            }
        } catch (e: Exception) {
            e.printStackTrace()
            Result.failure(e)
        }
    }
}