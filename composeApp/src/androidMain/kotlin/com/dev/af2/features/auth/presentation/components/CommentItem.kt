package com.dev.af2.features.auth.presentation.components


import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.jetbrains.compose.resources.painterResource

import com.dev.af2.features.auth.domain.Comment
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.berserk
import androidx.compose.ui.layout.onSizeChanged

@Composable
fun CommentItem(
    comment: Comment,
    onLikeClick: (Comment) -> Unit
) {
    val openSansFamily = getOpenSansFontFamily()

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.Top // Alineación arriba por si el texto es largo
    ) {
        // 1. Avatar
        Image(
            painter = painterResource(Res.drawable.berserk), // Placeholder
            contentDescription = null,
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape),
            contentScale = ContentScale.Crop
        )

        Spacer(modifier = Modifier.width(12.dp))

        // 2. Contenido (Usuario + Texto + Metadata)
        Column(modifier = Modifier.weight(1f)) {
            // Texto rico: Usuario en negrita + Comentario
            Text(
                text = buildAnnotatedString {
                    withStyle(SpanStyle(fontWeight = FontWeight.Bold, color = Color(0xFF2D2D2D))) {
                        append(comment.username)
                    }
                    append(" ")
                    append(comment.text)
                },
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontFamily = openSansFamily,
                    fontSize = 14.sp,
                    lineHeight = 20.sp,
                    color = Color(0xFF423646)
                )
            )

            Spacer(modifier = Modifier.height(4.dp))

            // Metadata: Tiempo, Likes, Responder
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = comment.timestamp,
                    style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray, fontSize = 12.sp)
                )
                Spacer(modifier = Modifier.width(16.dp))
                if (comment.likesCount > 0) {
                    Text(
                        text = "${comment.likesCount} me gusta",
                        style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray, fontSize = 12.sp)
                    )
                    Spacer(modifier = Modifier.width(16.dp))
                }
                Text(
                    text = "Responder",
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = Color.Gray,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                )
            }
        }

        // 3. Botón Like (Corazón pequeño a la derecha)
        IconButton(
            onClick = {onLikeClick(comment)},
            modifier = Modifier.size(20.dp).align(Alignment.CenterVertically)
        ) {
            Icon(
                imageVector = if (comment.isLiked) Icons.Default.Favorite else Icons.Outlined.FavoriteBorder,
                contentDescription = "Like comentario",
                tint = if (comment.isLiked) Color.Red else Color.Gray,
                modifier = Modifier.size(14.dp) // Icono muy sutil
            )
        }
    }
}