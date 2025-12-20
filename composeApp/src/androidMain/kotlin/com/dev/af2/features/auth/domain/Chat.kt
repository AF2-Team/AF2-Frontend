package com.dev.af2.features.auth.domain
//sujeto a cambios debido a que no sabemos si se logra implementar
data class Chat(
    val id: String,
    val username: String,
    val userAvatar: String, // URL o recurso local
    val lastMessage: String,
    val timestamp: String,  // "10:30 AM", "Ayer"
    val unreadCount: Int = 0,
    val isOnline: Boolean = false
)