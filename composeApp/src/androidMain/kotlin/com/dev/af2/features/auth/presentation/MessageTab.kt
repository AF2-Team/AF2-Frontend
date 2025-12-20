package com.dev.af2.features.auth.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChatBubbleOutline
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.rememberVectorPainter
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.navigator.tab.Tab
import cafe.adriel.voyager.navigator.tab.TabOptions
import com.dev.af2.features.auth.domain.Chat
import com.dev.af2.features.auth.presentation.components.ChatItem
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import com.dev.af2.features.auth.presentation.components.ChatDetailPage

// --- TABS ---
object MessagesTab : Tab {

    override val options: TabOptions
        @Composable
        get() {
            val title = "Mensajes"
            val icon = rememberVectorPainter(Icons.Default.ChatBubbleOutline)
            return remember { TabOptions(index = 3u, title = title, icon = icon) }
        }

    @Composable
    override fun Content() {
        val openSansFamily = getOpenSansFontFamily()


        // --- ESTADO MOCK (Lista mutable para poder borrar) ---
        // Usamos toMutableStateList para que la UI reaccione a los cambios
        val chats = remember {
            mutableStateListOf(
                Chat(
                    "1",
                    "Sofia Design",
                    "",
                    "¡Hola! ¿Viste el nuevo diseño?",
                    "10:30 AM",
                    2,
                    true
                ),
                Chat(
                    "2",
                    "Carlos Dev",
                    "",
                    "El PR ya está listo para revisión",
                    "09:15 AM",
                    0,
                    true
                ),
                Chat("3", "Maria Art", "", "Gracias por compartir 😊", "Ayer", 0, false),
                Chat("4", "John Doe", "", "¿Cuándo nos reunimos?", "Ayer", 1, false),
                Chat("5", "Pixel Studio", "", "Te enviamos la cotización", "Lun", 0, false)
            )
        }

        Scaffold(
            topBar = {
                // Header personalizado
                Row(
                    modifier = Modifier.Companion
                        .fillMaxWidth()
                        .background(Color.Companion.White)
                        .padding(horizontal = 20.dp, vertical = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Companion.CenterVertically
                ) {
                    Text(
                        text = "Mensajes",
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontFamily =openSansFamily,
                            fontWeight = FontWeight.Normal,
                            fontSize = 28.sp,
                            color = Color(0xFF423646)
                        )
                    )

                    // Botón "Nuevo Mensaje"
                    IconButton(
                        onClick = { /* Acción nuevo chat */ },
                        modifier = Modifier.Companion.size(40.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Edit,
                            contentDescription = "Nuevo Chat",
                            tint = Color(0xFFBCA1BD) // Color de acento
                        )
                    }
                }
            },
            containerColor = Color.Companion.White
        ) { paddingValues ->

            if (chats.isEmpty()) {
                // Estado Vacío
                Box(
                    modifier = Modifier.Companion.fillMaxSize().padding(paddingValues),
                    contentAlignment = Alignment.Companion.Center
                ) {
                    Text(
                        text = "No tienes mensajes aún",
                        color = Color.Companion.Gray,
                        fontFamily = openSansFamily
                    )
                }
            } else {
                // Lista de Chats
                LazyColumn(
                    modifier = Modifier.Companion
                        .fillMaxSize()
                        .padding(paddingValues)
                ) {
                    items(
                        items = chats,
                        key = { it.id } // Importante para que Compose anime el borrado correctamente
                    ) { chat ->
                        val rootNavigator = LocalNavigator.currentOrThrow.parent
                        ChatItem(
                            chat = chat,
                            onClick = {

                                rootNavigator?.push(
                                    ChatDetailPage(
                                        chatId = chat.id,
                                        username = chat.username,
                                        avatar = chat.userAvatar
                                    )
                                )
                            },
                            onDelete = {
                                // Lógica de borrado (Simulada)
                                chats.remove(chat)
                                println("Chat ${chat.id} eliminado")
                            }
                        )
                        // Separador sutil
                        HorizontalDivider(
                            modifier = Modifier.Companion.padding(start = 88.dp), // Indentado para alinear con texto
                            color = Color(0xFFF0F0F0),
                            thickness = 1.dp
                        )
                    }
                }
            }
        }
    }
}