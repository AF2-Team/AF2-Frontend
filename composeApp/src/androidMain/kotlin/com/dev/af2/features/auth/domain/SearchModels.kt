package com.dev.af2.features.auth.domain

import com.dev.af2.features.auth.data.remote.User
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Tag(
    @SerialName("_id") val id: String,
    val name: String,
    val postsCount: Int = 0
)

// Respuesta para cuando buscamos "Todo"
@Serializable
data class SearchGlobalResponse(
    val users: List<User> = emptyList(),
    val posts: List<Post> = emptyList(),
    val tags: List<Tag> = emptyList()
)

// Enum para controlar los Tabs de la UI
enum class SearchFilter(val label: String) {
    ALL("Todo"),
    USERS("Personas"),
    POSTS("Posts"),
    TAGS("Etiquetas")
}