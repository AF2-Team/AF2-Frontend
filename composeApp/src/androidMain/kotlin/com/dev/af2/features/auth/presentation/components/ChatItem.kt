package com.dev.af2.features.auth.presentation.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.jetbrains.compose.resources.painterResource

import com.dev.af2.features.auth.domain.Chat
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.logo_watercolor

// Colores
private val ColorDarkText = Color(0xFF423646)
private val ColorUnreadBadge = Color(0xFFBCA1BD) // Morado/Rosa de la marca
private val ColorDeleteBackground = Color(0xFFEF4444) // Rojo para borrar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatItem(
    chat: Chat,
    onClick: () -> Unit,
    onDelete: () -> Unit
) {
    val openSansFamily = getOpenSansFontFamily()

    // Estado para el SwipeToDismiss
    val dismissState = rememberSwipeToDismissBoxState(
        confirmValueChange = {
            if (it == SwipeToDismissBoxValue.EndToStart) {
                onDelete()
                true // Retorna true para confirmar la acción visualmente
            } else {
                false
            }
        }
    )

    SwipeToDismissBox(
        state = dismissState,
        backgroundContent = {
            val color = if (dismissState.dismissDirection == SwipeToDismissBoxValue.EndToStart) {
                ColorDeleteBackground
            } else {
                Color.Transparent
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(color)
                    .padding(end = 24.dp),
                contentAlignment = Alignment.CenterEnd
            ) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Borrar",
                    tint = Color.White
                )
            }
        },
        content = {
            // Contenido Principal (La fila del chat)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .clickable { onClick() }
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // 1. AVATAR CON INDICADOR ONLINE
                Box {
                    Image(
                        painter = painterResource(Res.drawable.logo_watercolor), // Placeholder
                        contentDescription = null,
                        modifier = Modifier
                            .size(56.dp)
                            .clip(CircleShape)
                            .background(Color.LightGray),
                        contentScale = ContentScale.Crop
                    )

                    if (chat.isOnline) {
                        Box(
                            modifier = Modifier
                                .size(14.dp)
                                .align(Alignment.BottomEnd)
                                .offset(x = (-2).dp, y = (-2).dp)
                                .clip(CircleShape)
                                .background(Color(0xFF4CAF50)) // Verde online
                                .border(2.dp, Color.White, CircleShape)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(16.dp))

                // 2. INFO CENTRAL (Nombre + Mensaje)
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = chat.username,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = ColorDarkText,
                                fontSize = 16.sp
                            )
                        )

                        // Hora
                        Text(
                            text = chat.timestamp,
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = if (chat.unreadCount > 0) ColorUnreadBadge else Color.Gray,
                                fontWeight = if (chat.unreadCount > 0) FontWeight.Bold else FontWeight.Normal
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = chat.lastMessage,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontFamily = openSansFamily,
                                color = if (chat.unreadCount > 0) ColorDarkText else Color.Gray,
                                fontWeight = if (chat.unreadCount > 0) FontWeight.Bold else FontWeight.Normal
                            ),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            modifier = Modifier.weight(1f)
                        )

                        // Badge de No Leídos
                        if (chat.unreadCount > 0) {
                            Spacer(modifier = Modifier.width(8.dp))
                            Box(
                                modifier = Modifier
                                    .size(20.dp)
                                    .clip(CircleShape)
                                    .background(ColorUnreadBadge),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = chat.unreadCount.toString(),
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        }
    )
}