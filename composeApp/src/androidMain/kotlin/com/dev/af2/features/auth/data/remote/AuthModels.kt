package com.dev.af2.features.auth.data.remote

import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName
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
@Serializable
data class LoginRequest(
    val email: String, // O 'username', dependiendo de cómo lo pida tu backend
    val password: String
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

@Serializable
data class User(
    @SerialName("_id") val id: String,
    val name: String,
    val username: String,
    val email: String,


    @SerialName("avatarUrl") val avatar: String? = null,

    val bio: String? = null,


    val followersCount: Int = 0,
    val followingCount: Int = 0,
    val postsCount: Int = 0
)

@Serializable
data class LikeResponse(
    val liked: Boolean,
    val likesCount: Int
)