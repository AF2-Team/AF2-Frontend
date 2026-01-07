package com.dev.af2.features.auth.data.remote

import kotlinx.serialization.Serializable

@Serializable
data class BaseResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T
)
@Serializable
data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val username: String
)

// Respuesta que el backend
@Serializable
data class AuthResponse(
    val id: String,
    val email: String,
    val name: String,
    val username: String,
    val token: String
)

// Para manejar errores del backend
@Serializable
data class ErrorResponse(
    val message: String
)