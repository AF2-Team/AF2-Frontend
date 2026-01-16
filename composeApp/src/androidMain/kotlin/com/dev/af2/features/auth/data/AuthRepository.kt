package com.dev.af2.features.auth.data

import com.dev.af2.core.network.NetworkModule
import com.dev.af2.core.network.TokenManager
import com.dev.af2.features.auth.data.remote.AuthResponse
import com.dev.af2.features.auth.data.remote.BackendErrorWrapper
import com.dev.af2.features.auth.data.remote.BaseResponse
import com.dev.af2.features.auth.data.remote.LoginRequest
import com.dev.af2.features.auth.data.remote.ProfileResponse
import com.dev.af2.features.auth.data.remote.RegisterRequest
import com.dev.af2.features.auth.data.remote.User
import com.dev.af2.features.auth.domain.UserProfileResponse
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.patch
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.request.forms.MultiPartFormDataContent
import io.ktor.client.request.forms.formData
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText // Importante para leer texto crudo
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive

class AuthRepository {
    private val client = NetworkModule.client

    // --- FUNCIONES PRINCIPALES (Sin cambios en lógica, solo llaman al nuevo manejador de errores) ---

    suspend fun register(request: RegisterRequest): Result<AuthResponse> {
        return try {
            val response = client.post("auth/signup") { setBody(request) }
            if (response.status.isSuccess()) {
                val wrapper = response.body<BaseResponse<AuthResponse>>()
                Result.success(wrapper.data)
            } else {
                Result.failure(Exception(extractErrorMessage(response)))
            }
        } catch (e: Exception) {
            e.printStackTrace()
            Result.failure(e)
        }
    }

    suspend fun login(request: LoginRequest): Result<AuthResponse> {
        return try {
            val response = client.post("auth/login") { setBody(request) }
            if (response.status.isSuccess()) {
                val wrapper = response.body<BaseResponse<AuthResponse>>()
                Result.success(wrapper.data)
            } else {
                Result.failure(Exception(extractErrorMessage(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun changePassword(currentPass: String, newPass: String): Result<Boolean> {
        return try {
            val token = TokenManager.token ?: throw Exception("No iniciaste sesión")
            val response = client.post("auth/change-password") {
                header("Authorization", "Bearer $token")
                contentType(ContentType.Application.Json)
                setBody(mapOf("currentPassword" to currentPass, "newPassword" to newPass))
            }

            if (response.status.isSuccess()) {
                Result.success(true)
            } else {
                Result.failure(Exception(extractErrorMessage(response)))
            }
        } catch (e: Exception) {
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
                Result.success(true)
            } else {
                Result.failure(Exception(extractErrorMessage(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getMe(): Result<User> {
        return try {
            val token = TokenManager.token ?: throw Exception("No iniciaste sesión")
            val response = client.get("user/me") { header("Authorization", "Bearer $token") }

            if (response.status.isSuccess()) {
                val wrapper = response.body<BaseResponse<ProfileResponse>>()
                val profileData = wrapper.data
                val userWithStats = profileData.user.copy(
                    followersCount = profileData.stats?.followers ?: profileData.user.followersCount,
                    followingCount = profileData.stats?.following ?: profileData.user.followingCount,
                    postsCount = profileData.stats?.posts ?: profileData.user.postsCount
                )
                Result.success(userWithStats)
            } else {
                Result.failure(Exception(extractErrorMessage(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getUserProfile(userId: String): Result<UserProfileResponse> {
        return try {
            val token = TokenManager.token
            val response = client.get("user/$userId") { header("Authorization", "Bearer $token") }

            if (response.status.isSuccess()) {
                Result.success(response.body<UserProfileResponse>())
            } else {
                Result.failure(Exception(extractErrorMessage(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateAvatar(imageBytes: ByteArray): Result<User> {
        return try {
            val token = TokenManager.token ?: throw Exception("No iniciaste sesión")
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
                val wrapper = response.body<BaseResponse<User>>()
                Result.success(wrapper.data)
            } else {
                Result.failure(Exception(extractErrorMessage(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // --- MAGIA: MANEJO DE ERRORES INTELIGENTE Y TRADUCCIÓN ---

    private suspend fun extractErrorMessage(response: HttpResponse): String {
        // 1. Obtenemos el texto crudo para no fallar si el JSON está mal formado
        val rawBody = response.bodyAsText()

        try {
            // Intentamos parsear manualmente para ser más flexibles
            val jsonElement = Json.parseToJsonElement(rawBody)
            val jsonObject = jsonElement.jsonObject

            // Buscamos el mensaje en varios lugares posibles
            var serverMessage = ""

            // Caso A: Estructura { "message": "...", "details": ... }
            if (jsonObject.containsKey("message")) {
                serverMessage = jsonObject["message"]?.jsonPrimitive?.content ?: ""

                // Si hay detalles específicos (ej: reglas de password), los concatenamos
                if (jsonObject.containsKey("details")) {
                    val details = jsonObject["details"]?.jsonObject
                    // Buscamos el primer error dentro de 'details'
                    val firstDetail = details?.values?.firstOrNull()?.toString() // Simplificado

                    // Limpiamos un poco el formato del detalle (quita corchetes y comillas extra)
                    if (firstDetail != null) {
                        val cleanDetail = firstDetail.replace("[\"", "").replace("\"]", "").replace("\"", "")
                        if (cleanDetail.isNotBlank()) {
                            serverMessage = "$serverMessage: $cleanDetail"
                        }
                    }
                }
            }
            // Caso B: Estructura { "error": { "message": "..." } }
            else if (jsonObject.containsKey("error")) {
                val errorObj = jsonObject["error"]?.jsonObject
                serverMessage = errorObj?.get("message")?.jsonPrimitive?.content ?: ""
            }

            // Si no encontramos nada, usamos el texto crudo o el código de estado
            if (serverMessage.isBlank()) {
                serverMessage = "Error ${response.status.value}"
            }

            // 2. TRADUCIR EL MENSAJE AL ESPAÑOL
            return translateMessage(serverMessage)

        } catch (e: Exception) {
            // Si falla el parseo JSON (ej: HTML de error 404 o 500)
            return when (response.status.value) {
                404 -> "Recurso no encontrado (404)"
                500 -> "Error interno del servidor (500)"
                401 -> "Sesión expirada o inválida"
                else -> "Error de conexión (${response.status.value})"
            }
        }
    }

    private fun translateMessage(original: String): String {
        val lower = original.lowercase()

        // --- DICCIONARIO DE ERRORES ---
        return when {
            // Contraseñas
            lower.contains("weak password") || lower.contains("at least 8 characters") ->
                "La contraseña es muy débil. Debe tener al menos 8 caracteres, incluir números y letras."
            lower.contains("incorrect password") -> "La contraseña actual es incorrecta."
            lower.contains("password") && lower.contains("match") -> "Las contraseñas no coinciden."

            // Usuarios / Auth
            lower.contains("user not found") -> "Usuario no encontrado."
            lower.contains("email already in use") || lower.contains("email already exists") ->
                "Este correo electrónico ya está registrado."
            lower.contains("username already taken") -> "Este nombre de usuario ya está ocupado."
            lower.contains("invalid credentials") -> "Correo o contraseña incorrectos."
            lower.contains("unauthorized") -> "No tienes permiso para realizar esta acción."

            // Servidor / General
            lower.contains("internal server error") -> "Ocurrió un problema en nuestros servidores. Intenta más tarde."
            lower.contains("route") && lower.contains("not found") -> "Error técnico: Ruta no encontrada."

            // Si no hay traducción exacta, devolvemos el original (o lo limpiamos un poco)
            else -> original.replace("Validation error:", "Error de validación:")
        }
    }
}