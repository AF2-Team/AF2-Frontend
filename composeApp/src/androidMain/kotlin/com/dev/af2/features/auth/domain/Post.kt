package com.dev.af2.features.auth.domain

data class Post(
    val id: String,
    val username: String,
    val userAvatar: String, // URL o recurso local por ahora
    val imageUrl: String,   // URL de la foto del post
    val description: String,
    val likesCount: Int,
    val commentsCount: Int,
    val isLiked: Boolean = false,
    val isSaved: Boolean = false
)