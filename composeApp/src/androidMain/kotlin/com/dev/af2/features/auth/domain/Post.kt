package com.dev.af2.features.auth.domain

import kotlinx.serialization.*
import kotlinx.serialization.descriptors.*
import kotlinx.serialization.encoding.*
import kotlinx.serialization.json.*

@Serializable
data class PostUser(
    // Dejamos el nombre limpio para usarlo en tu código UI
    val id: String,
    val name: String? = null,
    val username: String,
    val avatar: String? = null,
    val email: String? = null,
    var isFollowing: Boolean = false
)

object PostAuthorSerializer : KSerializer<PostUser> {
    // Usamos el serializer generado por defecto solo como referencia para el descriptor
    private val delegateSerializer = PostUser.serializer()
    override val descriptor: SerialDescriptor = delegateSerializer.descriptor

    override fun deserialize(decoder: Decoder): PostUser {
        val input = (decoder as JsonDecoder).decodeJsonElement()

        // CASO 1: El backend envió solo un String (el ID suelto)
        if (input is JsonPrimitive && input.isString) {
            return PostUser(
                id = input.content,
                name = "Usuario",
                username = "desconocido",
                avatar = null
            )
        }

        // CASO 2: El backend envió el objeto completo
        // Aquí hacemos la magia para soportar 'id' Y '_id'
        val jsonObject = input.jsonObject

        // 1. Buscamos el ID en "_id" O en "id"
        val id = jsonObject["_id"]?.jsonPrimitive?.content
            ?: jsonObject["id"]?.jsonPrimitive?.content
            ?: "" // O lanzar error si es crítico

        // 2. Extraemos el resto de campos manualmente para evitar problemas de nombres
        val name = jsonObject["name"]?.jsonPrimitive?.content
        val username = jsonObject["username"]?.jsonPrimitive?.content ?: "Unknown"

        // OJO: El JSON suele traer "avatarUrl", pero tu clase usa "avatar"
        val avatar = jsonObject["avatarUrl"]?.jsonPrimitive?.content
            ?: jsonObject["avatar"]?.jsonPrimitive?.content

        val email = jsonObject["email"]?.jsonPrimitive?.content
        val isFollowing = jsonObject["isFollowing"]?.jsonPrimitive?.booleanOrNull ?: false

        return PostUser(
            id = id,
            name = name,
            username = username,
            avatar = avatar,
            email = email,
            isFollowing = isFollowing
        )
    }

    override fun serialize(encoder: Encoder, value: PostUser) {
        // Para enviar datos al servidor (si alguna vez lo haces), usamos el estándar
        encoder.encodeSerializableValue(delegateSerializer, value)
    }
}

@Serializable
data class Post(
    @SerialName("_id") val id: String,

    @SerialName("user")
    @Serializable(with = PostAuthorSerializer::class) // Tu serializer inteligente
    val author: PostUser,

    val text: String = "",
    val media: List<PostMedia> = emptyList(),

    // Campos legacy
    val mediaUrl: String? = null,
    val mediaId: String? = null,

    val type: String = "post",
    val likesCount: Int = 0,
    val isLiked: Boolean = false,
    val commentsCount: Int = 0,
    val repostsCount: Int = 0,
    val createdAt: String? = null,
    val isFavorited: Boolean = false,
    val favoritesCount: Int = 0,
)

@Serializable
data class PostMedia(
    val url: String,
    val fileId: String? = null
)