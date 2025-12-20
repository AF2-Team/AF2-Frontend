package com.dev.af2.features.auth.domain

enum class NotificationType {
    LIKE,       // Alguien le dio like a tu foto
    COMMENT,    // Alguien comentó
    FOLLOW,     // Alguien te empezó a seguir
    MENTION     // Alguien te mencionó
}
//Sujeta a cambios en el tiempo
data class Notification(
    val id: String,
    val userId: String,
    val username: String,
    val userAvatar: String, // URL o recurso
    val type: NotificationType,
    val timeAgo: String,    // "2h", "1d"
    val contentPreview: String? = null, // Para comentarios: "Qué buena foto!"
    val postImageUrl: String? = null,   // Para likes/comentarios: la foto afectada
    val isFollowing: Boolean = false    // Para tipo FOLLOW: estado del botón
)