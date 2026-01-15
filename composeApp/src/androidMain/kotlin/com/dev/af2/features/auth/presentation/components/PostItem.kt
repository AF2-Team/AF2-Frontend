package com.dev.af2.features.auth.presentation.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.StarOutline
import androidx.compose.material.icons.filled.SubdirectoryArrowRight
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage

import com.dev.af2.features.auth.domain.Post
import com.dev.af2.core.designsystem.getAlegreyaFontFamily

@Composable
fun PostItem(
    post: Post,
    currentUserId: String? = null, // ID del usuario logueado para validar propiedad
    onLikeClick: () -> Unit,
    onCommentClick: () -> Unit,
    onShareClick: () -> Unit,
    onProfileClick: () -> Unit,
    onFollowClick: (String) -> Unit,
    onEditClick: (Post) -> Unit = {},   // Callback Editar
    onDeleteClick: (Post) -> Unit = {}  // Callback Eliminar
) {
    val alegreyaFamily = getAlegreyaFontFamily()

    // LÓGICA DE MEDIA
    val mediaItem = post.media.firstOrNull()
    val finalImageUrl = mediaItem?.url ?: post.mediaUrl
    val avatarUrl = post.author.avatar
        ?: "https://ui-avatars.com/api/?name=${post.author.name}&background=random&color=fff"

    // [LOGICA] ¿Es mi post?
    // Comparamos el ID del autor del post con el ID del usuario actual
    val isMine = currentUserId != null && post.author.id == currentUserId

    // Estado del menú desplegable
    var showMenu by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(bottom = 24.dp)
    ) {
        // --- 1. HEADER DEL POST (Usuario + Menu/Seguir) ---
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // IZQUIERDA: Avatar + Nombre
            Row(verticalAlignment = Alignment.CenterVertically) {
                AsyncImage(
                    model = avatarUrl,
                    contentDescription = "Avatar de ${post.author.username}",
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Color.LightGray)
                        .clickable { onProfileClick() },
                    contentScale = ContentScale.Crop
                )

                Spacer(modifier = Modifier.width(10.dp))

                Column {
                    Text(
                        text = "@${post.author.username}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Color(0xFF2D2D2D),
                        modifier = Modifier.clickable { onProfileClick() }
                    )
                    Text(
                        text = "Barquisimeto, VE", // Placeholder o data real si la tienes
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                }
            }

            // DERECHA: Menú (Si es mío) o Seguir (Si es de otro)
            if (isMine) {
                // --- MENÚ DE TRES PUNTOS ---
                Box {
                    IconButton(onClick = { showMenu = true }) {
                        Icon(
                            imageVector = Icons.Default.MoreVert,
                            contentDescription = "Opciones",
                            tint = Color.Gray
                        )
                    }
                    DropdownMenu(
                        expanded = showMenu,
                        onDismissRequest = { showMenu = false },
                        modifier = Modifier.background(Color.White)
                    ) {
                        DropdownMenuItem(
                            text = { Text("Editar") },
                            onClick = {
                                showMenu = false
                                onEditClick(post)
                            },
                            leadingIcon = { Icon(Icons.Default.Edit, null) }
                        )
                        DropdownMenuItem(
                            text = { Text("Eliminar", color = Color.Red) },
                            onClick = {
                                showMenu = false
                                onDeleteClick(post)
                            },
                            leadingIcon = { Icon(Icons.Default.Delete, null, tint = Color.Red) }
                        )
                    }
                }
            } else {
                // --- BOTÓN SEGUIR ---
                val isFollowing = post.author.isFollowing
                Text(
                    text = if (isFollowing) "Siguiendo" else "Seguir",
                    color = if (isFollowing) Color.Gray else Color(0xFF1291EB),
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    modifier = Modifier.clickable { onFollowClick(post.author.id) }
                )
            }
        }

        // --- 2. IMAGEN DEL POST ---
        if (!finalImageUrl.isNullOrBlank()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(4f/5f)
                    .background(Color(0xFFF0F0F0))
            ) {
                AsyncImage(
                    model = finalImageUrl,
                    contentDescription = "Post Image",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            }
        }

        // --- 3. ACCIONES (Like, Comment, Share) ---
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onLikeClick) {
                    Icon(
                        imageVector = if (post.isLiked) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Like",
                        tint = if (post.isLiked) Color.Red else Color.Black
                    )
                }
                IconButton(onClick = onCommentClick) {
                    Icon(
                        imageVector = Icons.Outlined.ChatBubbleOutline,
                        contentDescription = "Comment",
                        tint = Color.Black
                    )
                }
                IconButton(onClick = onShareClick) {
                    Icon(
                        imageVector = Icons.Default.SubdirectoryArrowRight,
                        contentDescription = "Share",
                        tint = Color.Black
                    )
                }
            }

            IconButton(onClick = { /* Save logic */ }) {
                Icon(
                    imageVector = Icons.Default.StarOutline,
                    contentDescription = "Save",
                    tint = Color.Black
                )
            }
        }

        // --- 4. TEXTO, LIKES Y COMENTARIOS ---
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            if (post.likesCount > 0) {
                Text(
                    text = "${post.likesCount} Me gusta",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
            }

            if (post.text.isNotBlank()) {
                Text(
                    text = post.text,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontFamily = alegreyaFamily,
                        fontSize = 15.sp,
                        lineHeight = 20.sp
                    ),
                    maxLines = 3,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(4.dp))
            }

            if (post.commentsCount > 0) {
                Text(
                    text = "Ver los ${post.commentsCount} comentarios",
                    color = Color.Gray,
                    fontSize = 14.sp,
                    modifier = Modifier.clickable { onCommentClick() }
                )
            }
        }
    }
}