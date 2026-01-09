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

@Serializable
data class BackendErrorWrapper(
    val success: Boolean,
    val error: BackendErrorDetail? = null
)

@Serializable
data class BackendErrorDetail(
    val name: String? = null,
    val message: String, // "Username already taken" viene aquí
    val userMessage: String? = null,
    val code: String? = null,
    val statusCode: Int? = null
)