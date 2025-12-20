package com.dev.af2.features.auth.presentation.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.AttachFile
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import org.jetbrains.compose.resources.painterResource
import androidx.compose.foundation.layout.imePadding

import com.dev.af2.features.auth.domain.Message
import com.dev.af2.features.auth.domain.MessageStatus
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.logo_watercolor
import androidx.compose.foundation.layout.navigationBarsPadding
// --- COLORES ---
private val ColorMyMessageBg = Color(0xFFBCA1BD) // Morado claro marca
private val ColorOtherMessageBg = Color(0xFFF2F2F2) // Gris claro
private val ColorDarkText = Color(0xFF423646)

// Argumentos para saber con quién chateamos
data class ChatDetailPage(val chatId: String, val username: String, val avatar: String) : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        ChatDetailScreen(
            username = username,
            onBackClick = { navigator.pop() }
        )
    }
}

@Composable
fun ChatDetailScreen(
    username: String,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val openSansFamily = getOpenSansFontFamily()


    // Estado del input
    var messageText by remember { mutableStateOf("") }

    // Lista de mensajes (Mock) - Usamos mutableStateList para simular envío
    val messages = remember {
        mutableStateListOf(
            Message("1", "Hola! ¿Cómo estás? 👋", false, "10:00 AM"),
            Message("2", "Todo bien, trabajando en la app 🚀", true, "10:05 AM", MessageStatus.READ),
            Message("3", "¡Qué genial! Me encanta el diseño.", false, "10:06 AM"),
            Message("4", "Gracias! Estamos usando KMP.", true, "10:07 AM", MessageStatus.READ),
            Message("5", "¿Cuándo lanzan la beta?", false, "10:10 AM"),
        )
    }

    Scaffold(
        topBar = {
            ChatHeader(username, onBackClick)

        },
        bottomBar = {
            ChatInputBar(
                modifier = Modifier
                    .navigationBarsPadding()
                    .imePadding(),
                text = messageText,
                onTextChange = { messageText = it },
                onSendClick = {
                    if (messageText.isNotBlank()) {
                        // Simular envío
                        messages.add(
                            Message(
                                id = "${System.currentTimeMillis()}",
                                text = messageText,
                                isFromMe = true,
                                timestamp = "Ahora",
                                status = MessageStatus.SENT
                            )
                        )
                        messageText = "" // Limpiar input
                    }
                }
            )
        },
        containerColor = Color.White
    ) { paddingValues ->

        // LazyColumn para los mensajes
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp),
            reverseLayout = true, // Los nuevos mensajes aparecen abajo (al final de la lista invertida)
            contentPadding = PaddingValues(vertical = 16.dp) // Espacio extra al final
        ) {
            // Invertimos la lista para que reverseLayout funcione lógicamente
            items(messages.reversed()) { message ->
                MessageBubble(message)
                Spacer(modifier = Modifier.height(12.dp))
            }
        }
    }
}

// --- 1. HEADER PERSONALIZADO ---
@Composable
private fun ChatHeader(username: String, onBackClick: () -> Unit,) {
    Surface(
        shadowElevation = 4.dp, // Sombra suave
        color = Color.White,
                modifier = Modifier.windowInsetsPadding(WindowInsets.statusBars)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(64.dp)
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Botón Atrás
            IconButton(onClick = onBackClick) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Atrás",
                    tint = ColorDarkText
                )
            }

            // Avatar
            Image(
                painter = painterResource(Res.drawable.logo_watercolor),
                contentDescription = null,
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(Color.LightGray),
                contentScale = ContentScale.Crop
            )

            Spacer(modifier = Modifier.width(12.dp))

            // Info Usuario
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = username,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = ColorDarkText,
                        fontSize = 16.sp
                    )
                )
                Text(
                    text = "En línea",
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = Color(0xFF4CAF50), // Verde online
                        fontSize = 12.sp
                    )
                )
            }

            // Menú Opciones
            IconButton(onClick = { /* Menú */ }) {
                Icon(
                    imageVector = Icons.Default.MoreVert,
                    contentDescription = "Opciones",
                    tint = Color.Gray
                )
            }
        }
    }
}

// --- 2. BURBUJA DE MENSAJE ---
@Composable
private fun MessageBubble(message: Message) {
    val bubbleShape = if (message.isFromMe) {
        RoundedCornerShape(topStart = 16.dp, topEnd = 0.dp, bottomStart = 16.dp, bottomEnd = 16.dp)
    } else {
        RoundedCornerShape(topStart = 0.dp, topEnd = 16.dp, bottomStart = 16.dp, bottomEnd = 16.dp)
    }

    val bgColor = if (message.isFromMe) ColorMyMessageBg else ColorOtherMessageBg
    val textColor = if (message.isFromMe) Color.White else ColorDarkText

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = if (message.isFromMe) Alignment.End else Alignment.Start
    ) {
        Box(
            modifier = Modifier
                .background(bgColor, bubbleShape)
                .padding(horizontal = 16.dp, vertical = 10.dp)
                // Limitar ancho máximo para que no ocupe toda la pantalla
                .widthIn(max = 280.dp)
        ) {
            Text(
                text = message.text,
                color = textColor,
                fontSize = 15.sp,
                lineHeight = 20.sp
            )
        }

        // Hora del mensaje
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = message.timestamp,
            fontSize = 11.sp,
            color = Color.Gray,
            modifier = Modifier.padding(horizontal = 4.dp)
        )
    }
}

// --- 3. BARRA DE ENTRADA (INPUT) ---
@Composable
private fun ChatInputBar(
    text: String,
    onTextChange: (String) -> Unit,
    onSendClick: () -> Unit,
    modifier: Modifier
) {
    Surface(
        color = Color.White,
        tonalElevation = 8.dp, // Sombra hacia arriba
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .padding(horizontal = 12.dp, vertical = 10.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Botón Adjuntar (Clip)
            IconButton(onClick = { /* Adjuntar */ }) {
                Icon(
                    imageVector = Icons.Default.AttachFile,
                    contentDescription = "Adjuntar",
                    tint = Color.Gray,
                    modifier = Modifier.size(24.dp)
                )
            }

            // Campo de Texto Redondeado
            BasicTextField(
                value = text,
                onValueChange = onTextChange,
                modifier = Modifier
                    .weight(1f)
                    .height(44.dp)
                    .background(Color(0xFFF5F5F5), RoundedCornerShape(22.dp))
                    .padding(horizontal = 16.dp),
                textStyle = TextStyle(fontSize = 16.sp, color = ColorDarkText),
                maxLines = 3,
                cursorBrush = SolidColor(ColorMyMessageBg),
                decorationBox = { innerTextField ->
                    Box(contentAlignment = Alignment.CenterStart) {
                        if (text.isEmpty()) {
                            Text(
                                "Escribe un mensaje...",
                                color = Color.Gray,
                                fontSize = 15.sp
                            )
                        }
                        innerTextField()
                    }
                }
            )

            Spacer(modifier = Modifier.width(8.dp))

            // Botón Enviar (Circular con fondo)
            IconButton(
                onClick = onSendClick,
                modifier = Modifier
                    .size(44.dp)
                    .background(ColorMyMessageBg, CircleShape)
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.Send,
                    contentDescription = "Enviar",
                    tint = Color.White,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}