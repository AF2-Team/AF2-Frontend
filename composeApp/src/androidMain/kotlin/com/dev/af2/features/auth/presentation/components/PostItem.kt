package com.dev.af2.features.auth.presentation.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Star
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
import org.jetbrains.compose.resources.painterResource

// Asegúrate de importar tu modelo actualizado
import com.dev.af2.features.auth.domain.Post
import com.dev.af2.core.designsystem.getAlegreyaFontFamily
import af2.composeapp.generated.resources.Res
import coil3.compose.AsyncImage
// Asegúrate de que estos recursos existan en tu proyecto
import af2.composeapp.generated.resources.image_post3
import af2.composeapp.generated.resources.image_profile

@Composable
fun PostItem(
    post: Post,
    onLikeClick: () -> Unit,
    onCommentClick: () -> Unit,
    onShareClick: () -> Unit,
    onProfileClick: () -> Unit,
    onFollowClick: (String) -> Unit

) {
    val alegreyaFamily = getAlegreyaFontFamily()

    // LÓGICA DE MEDIA:
    // 1. Buscamos en el array nuevo 'media'.
    // 2. Si está vacío, intentamos usar 'mediaUrl' (posts antiguos).
    val mediaItem = post.media.firstOrNull()
    val finalImageUrl = mediaItem?.url ?: post.mediaUrl
    val avatarUrl = post.author.avatar
        ?: "https://ui-avatars.com/api/?name=${post.author.name}&background=random&color=fff"

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(bottom = 24.dp)
    ) {
        // --- 1. HEADER DEL POST (Usuario) ---
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
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
                    // USERNAME
                    // Nota: Aquí iría post.author.username si el backend devuelve el objeto.
                    Text(
                        text = "@${post.author.username}", // Placeholder temporal hasta tener el objeto User
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Color(0xFF2D2D2D),
                        modifier = Modifier.clickable { onProfileClick() }
                    )
                    Text(
                        text = "Barquisimeto, VE",
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                }
            }
            val isFollowing = post.author.isFollowing
            Text(
                text = if (isFollowing) "Siguiendo" else "Seguir",
                color = if (isFollowing) Color.Gray else Color(0xFF1291EB),
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp,
                modifier = Modifier.clickable { /* TODO */ }
            )
        }

        // --- 2. IMAGEN DEL POST ---
        // Solo mostramos el Box si hay una imagen válida
        if (!finalImageUrl.isNullOrBlank()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(4f/5f) // Formato vertical típico de redes
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

        // --- 3. ACCIONES ---
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onLikeClick) {
                    // Asumimos que likesCount > 0 es likeado visualmente por ahora
                    // ya que isLiked no venía en el JSON
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

        // --- 4. TEXTO Y LIKES ---
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            if (post.likesCount > 0) {
                Text(
                    text = "${post.likesCount} Me gusta",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
            }

            // CORRECCIÓN: Usamos post.text
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