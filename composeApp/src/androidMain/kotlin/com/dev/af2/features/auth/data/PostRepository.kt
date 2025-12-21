package com.dev.af2.features.auth.data


import androidx.compose.runtime.mutableStateListOf
import com.dev.af2.features.auth.domain.Post

// Este objeto actúa como una base de datos en memoria.
// Al ser 'object', es único en toda la app (Singleton).
object PostRepository {

    // mutableStateListOf es MÁGICO: avisa automáticamente a la UI cuando cambia.
    private val _posts = mutableStateListOf<Post>(
        Post("1", "alirio_dev", "", "", "Disfrutando de KMP! 🚀 #Kotlin #Dev", 120, 5),
        Post("2", "design_pro", "", "", "Nuevo diseño disponible en Figma ✨", 85, 12),
        Post("3", "traveler_ve", "", "", "Los atardeceres de Barquisimeto son únicos 🌅", 340, 45, isLiked = true)
    )

    // Exponemos la lista como solo lectura para evitar modificaciones externas directas
    val posts: List<Post> get() = _posts

    fun addPost(description: String, imageUri: Any?) {
        val newPost = Post(
            id = System.currentTimeMillis().toString(),
            username = "Yo", // Usuario actual
            userAvatar = "", // Aquí iría tu avatar
            imageUrl = imageUri?.toString() ?: "", // Convertimos URI a String
            description = description,
            likesCount = 0,
            commentsCount = 0,
            isLiked = false,
            isSaved = false
        )
        // Agregamos al inicio de la lista (índice 0) para que salga arriba
        _posts.add(0, newPost)
    }
}