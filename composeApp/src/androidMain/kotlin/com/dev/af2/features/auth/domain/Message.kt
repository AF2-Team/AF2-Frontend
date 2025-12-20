package com.dev.af2.features.auth.domain

data class Message(
    val id: String,
    val text: String,
    val isFromMe: Boolean, // Determina si va a la derecha o izquierda
    val timestamp: String,
    val status: MessageStatus = MessageStatus.SENT // ENVIADO, ENTREGADO, LEÍDO
)

enum class MessageStatus {
    SENDING, SENT, DELIVERED, READ
}