package com.dev.af2.features.auth.data

import com.dev.af2.core.network.NetworkModule
import com.dev.af2.features.auth.data.remote.AuthResponse
import com.dev.af2.features.auth.data.remote.BaseResponse
import com.dev.af2.features.auth.data.remote.ErrorResponse
import com.dev.af2.features.auth.data.remote.RegisterRequest
import io.ktor.client.call.body
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.isSuccess

class AuthRepository {
    private val client = NetworkModule.client

    suspend fun register(request: RegisterRequest): Result<AuthResponse> {
        println("DEBUG_REPO: 1. Iniciando petición en Repositorio")
        return try {
            val response: HttpResponse = client.post("auth/signup") { // Recuerda: SIN barra al inicio
                setBody(request)
            }

            println("DEBUG_REPO: 2. Respuesta recibida. Status: ${response.status}")

            if (response.status.isSuccess()) {
                // ⚠️ CAMBIO AQUÍ: Leemos la 'BaseResponse' que contiene el 'AuthResponse'
                val wrapper = response.body<BaseResponse<AuthResponse>>()

                println("DEBUG_REPO: 3. Éxito! Datos desempaquetados: ${wrapper.data.email}")

                // Retornamos SOLO la parte de 'data' que es lo que espera tu app
                Result.success(wrapper.data)
            } else {
                val errorBody = response.body<String>()
                println("DEBUG_REPO: 3. Error del servidor: $errorBody")
                Result.failure(Exception("Error: ${response.status}"))
            }
        } catch (e: Exception) {
            println("DEBUG_REPO: ❌ EXCEPCIÓN: ${e.message}")
            e.printStackTrace()
            Result.failure(e)
        }
    }
}