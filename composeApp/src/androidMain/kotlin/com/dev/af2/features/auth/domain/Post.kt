package com.dev.af2.features.auth.domain
// (Asegurate que el paquete sea el correcto)

import kotlinx.serialization.*
import kotlinx.serialization.descriptors.*
import kotlinx.serialization.encoding.*
import kotlinx.serialization.json.*

// 1. Define tu modelo de Usuario (Ajusta los campos según tu User real)
@Serializable
data class User(
    @SerialName("_id") val id: String,
    val username: String = "Usuario Desconocido", // Valores por defecto para evitar crashes
    val avatar: String? = null,
    val email: String? = null
)

// 2. CREA ESTE SERIALIZADOR MÁGICO
object PostAuthorSerializer : KSerializer<User> {
    // Usamos el serializador por defecto de User como base
    private val delegateSerializer = User.serializer()

    // El descriptor describe la estructura (usamos la del usuario)
    override val descriptor: SerialDescriptor = delegateSerializer.descriptor

    override fun deserialize(decoder: Decoder): User {
        // Obtenemos el elemento JSON crudo
        val input = (decoder as JsonDecoder).decodeJsonElement()

        return if (input is JsonPrimitive && input.isString) {
            // CASO A: El backend envió solo un String ID ("author": "695dc...")
            // Creamos un usuario "dummy" con ese ID para que la app no explote
            User(
                id = input.content,
                username = "Usuario", // Placeholder hasta que cargue bien
                avatar = null
            )
        } else {
            // CASO B: El backend envió el objeto correcto ({"_id": "...", "username": "..."})
            // Usamos el deserializador normal
            decoder.json.decodeFromJsonElement(delegateSerializer, input)
        }
    }

    override fun serialize(encoder: Encoder, value: User) {
        // Para enviar datos de vuelta, usamos el normal
        encoder.encodeSerializableValue(delegateSerializer, value)
    }
}

// 3. APLICA EL SERIALIZADOR EN TU CLASE POST
@Serializable
data class Post(
    @SerialName("_id") val id: String,

    // --- AQUÍ ESTÁ EL TRUCO ---
    // Le decimos a Kotlin: "Usa mi lógica especial para leer este campo"
    @Serializable(with = PostAuthorSerializer::class)
    val author: User,

    val text: String = "",
    val media: List<PostMedia> = emptyList(),
    val mediaUrl: String? = null,
    val type: String = "post",
    val likesCount: Int = 0,
    val commentsCount: Int = 0,
    val repostsCount: Int = 0,
    val createdAt: String? = null
)

@Serializable
data class PostMedia(
    val url: String,
    val fileId: String? = null
)