package com.dev.af2.features.auth.domain

data class Comment(
    val id: String,
    val username: String,
    val userAvatar: String, // URL o recurso
    val text: String,
    val timestamp: String, // "2h", "1 sem"
    val likesCount: Int = 0,
    val isLiked: Boolean = false
)