package com.dev.af2.features.auth.presentation.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Send
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

// Imports de tu proyecto
import com.dev.af2.features.auth.domain.Post
import com.dev.af2.core.designsystem.getAlegreyaFontFamily
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.logo_watercolor // Usamos imágenes placeholder por ahora

@Composable
fun PostItem(
    post: Post,
    onLikeClick: () -> Unit,
    onCommentClick: () -> Unit,
    onShareClick: () -> Unit,
    onProfileClick: () -> Unit
) {
    val alegreyaFamily = getAlegreyaFontFamily()

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
                // Avatar (Placeholder)
                Image(
                    painter = painterResource(Res.drawable.logo_watercolor),
                    contentDescription = null,
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
                        text = post.username,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Color(0xFF2D2D2D),
                        modifier = Modifier.clickable { onProfileClick() }
                    )
                    // Ubicación o subtítulo opcional
                    Text(
                        text = "Barquisimeto, VE",
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                }
            }

            // Botón Seguir (Pequeño y sutil)
            Text(
                text = "Seguir",
                color = Color(0xFF1291EB), // Tu color de acento
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp,
                modifier = Modifier.clickable { /* TODO: Lógica seguir */ }
            )
        }

        // --- 2. IMAGEN DEL POST ---
        // Aquí usaríamos AsyncImage(model = post.imageUrl) con Coil en el futuro
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(400.dp) // Altura tipo Instagram vertical
                .background(Color(0xFFF0F0F0))
        ) {
            Image(
                painter = painterResource(Res.drawable.logo_watercolor), // Placeholder
                contentDescription = "Post Image",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        }

        // --- 3. ACCIONES (Like, Comentar, Compartir) ---
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                // Like
                IconButton(onClick = onLikeClick) {
                    Icon(
                        imageVector = if (post.isLiked) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Like",
                        tint = if (post.isLiked) Color.Red else Color.Black
                    )
                }
                // Comentar
                IconButton(onClick = onCommentClick) {
                    Icon(
                        imageVector = Icons.Outlined.ChatBubbleOutline,
                        contentDescription = "Comment",
                        tint = Color.Black
                    )
                }
                // Compartir
                IconButton(onClick = onShareClick) {
                    Icon(
                        imageVector = Icons.Default.Send, // El avioncito de papel
                        contentDescription = "Share",
                        tint = Color.Black
                    )
                }
            }

            // Guardar (Favorito)
            IconButton(onClick = { /* Save logic */ }) {
                Icon(
                    imageVector = Icons.Default.BookmarkBorder,
                    contentDescription = "Save",
                    tint = Color.Black
                )
            }
        }

        // --- 4. TEXTO Y LIKES ---
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Text(
                text = "${post.likesCount} Me gusta",
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Descripción con el nombre de usuario en negrita
            Text(
                text = post.description, // En un futuro concatenamos buildAnnotatedString
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontFamily = alegreyaFamily,
                    fontSize = 15.sp,
                    lineHeight = 20.sp
                ),
                maxLines = 3,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Ver los ${post.commentsCount} comentarios",
                color = Color.Gray,
                fontSize = 14.sp,
                modifier = Modifier.clickable { onCommentClick() }
            )
        }
    }
}