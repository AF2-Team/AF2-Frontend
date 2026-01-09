package com.dev.af2.features.auth.data

import com.dev.af2.core.network.NetworkModule
import com.dev.af2.features.auth.data.remote.AuthResponse
import com.dev.af2.features.auth.data.remote.BackendErrorWrapper
import com.dev.af2.features.auth.data.remote.BaseResponse
import com.dev.af2.features.auth.data.remote.LoginRequest
import com.dev.af2.features.auth.data.remote.RegisterRequest
import io.ktor.client.call.body
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.isSuccess

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
}