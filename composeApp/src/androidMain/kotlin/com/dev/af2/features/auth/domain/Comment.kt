package com.dev.af2.features.auth.domain

import com.dev.af2.features.auth.data.remote.User
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Comment(
    @SerialName("id") val id: String, // O "id" si tu backend lo devuelve limpio
    val text: String,
    val user: User, // Tu modelo User existente
    val createdAt: String
)