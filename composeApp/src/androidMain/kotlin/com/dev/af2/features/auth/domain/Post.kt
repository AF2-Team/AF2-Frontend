package com.dev.af2.features.auth.domain

import kotlinx.serialization.*
import kotlinx.serialization.descriptors.*
import kotlinx.serialization.encoding.*
import kotlinx.serialization.json.*


@Serializable
data class PostUser(
    @SerialName("_id") val id: String,
    val name: String,
    val username: String,
    @SerialName("avatarUrl")
    val avatar: String? = null,
    val email: String? = null,
    var isFollowing: Boolean = false
)

object PostAuthorSerializer : KSerializer<PostUser> {
    private val delegateSerializer = PostUser.serializer()
    override val descriptor: SerialDescriptor = delegateSerializer.descriptor

    override fun deserialize(decoder: Decoder): PostUser {
        val input = (decoder as JsonDecoder).decodeJsonElement()

        return if (input is JsonPrimitive && input.isString) {
            // CASO EMERGENCIA: El backend envió solo el ID string
            PostUser(
                id = input.content,
                name = "Usuario", // Placeholder
                username = "desconocido",
                avatar = null
            )
        } else {
            // CASO CORRECTO: El backend envió el objeto completo
            decoder.json.decodeFromJsonElement(delegateSerializer, input)
        }
    }

    override fun serialize(encoder: Encoder, value: PostUser) {
        encoder.encodeSerializableValue(delegateSerializer, value)
    }
}


@Serializable
data class Post(
    @SerialName("_id") val id: String,

    @SerialName("user")
    @Serializable(with = PostAuthorSerializer::class)
    val author: PostUser, // Usamos la clase corregida PostUser

    val text: String = "",
    val media: List<PostMedia> = emptyList(),

    // Campos legacy por compatibilidad
    val mediaUrl: String? = null,
    val mediaId: String? = null,

    val type: String = "post",
    val likesCount: Int = 0,
    val isLiked: Boolean = false,
    val commentsCount: Int = 0,
    val repostsCount: Int = 0,
    val createdAt: String? = null
)

@Serializable
data class PostMedia(
    val url: String,
    val fileId: String? = null
)