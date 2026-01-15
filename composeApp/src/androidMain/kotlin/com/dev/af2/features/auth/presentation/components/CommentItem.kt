package com.dev.af2.features.auth.presentation.components

import androidx.compose.foundation.Image
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

// Importa tu modelo actualizado
import com.dev.af2.features.auth.domain.Comment
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.berserk

@Composable
fun CommentItem(
    comment: Comment,
    onLikeClick: (Comment) -> Unit = {} // Por defecto vacío hasta implementar likes en comments
) {
    val openSansFamily = getOpenSansFontFamily()

    // Extraemos datos de forma segura según el nuevo modelo
    val username = comment.user.username
    val commentText = comment.text
    // La fecha viene cruda del backend (ISO string).
    // Idealmente usarías una función helper para convertirla a "hace 2h".
    // Por ahora mostramos "Hace un momento" o el string crudo recortado.
    val timeDisplay = "Reciente"

    // Mockeamos likes por ahora porque el backend aún no manda likes de comentarios
    val likesCount = 0
    val isLiked = false

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.Top
    ) {
        // 1. Avatar (Usamos placeholder, luego puedes poner AsyncImage con comment.user.avatar)
        Image(
            painter = painterResource(Res.drawable.berserk),
            contentDescription = null,
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape),
            contentScale = ContentScale.Crop
        )

        Spacer(modifier = Modifier.width(12.dp))

        // 2. Contenido
        Column(modifier = Modifier.weight(1f)) {
            // Usuario + Texto
            Text(
                text = buildAnnotatedString {
                    withStyle(SpanStyle(fontWeight = FontWeight.Bold, color = Color(0xFF2D2D2D))) {
                        append(username) // Usamos el username extraído
                    }
                    append(" ")
                    append(commentText)
                },
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontFamily = openSansFamily,
                    fontSize = 14.sp,
                    lineHeight = 20.sp,
                    color = Color(0xFF423646)
                )
            )

            Spacer(modifier = Modifier.height(4.dp))

            // Metadata
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = timeDisplay,
                    style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray, fontSize = 12.sp)
                )

                // Mostrar likes solo si hay (lógica visual lista para el futuro)
                if (likesCount > 0) {
                    Spacer(modifier = Modifier.width(16.dp))
                    Text(
                        text = "$likesCount me gusta",
                        style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray, fontSize = 12.sp)
                    )
                }

                Spacer(modifier = Modifier.width(16.dp))
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

        // 3. Botón Like (Visualmente listo, funcionalmente pendiente de backend)
        IconButton(
            onClick = { onLikeClick(comment) },
            modifier = Modifier.size(20.dp).align(Alignment.CenterVertically)
        ) {
            Icon(
                imageVector = if (isLiked) Icons.Default.Favorite else Icons.Outlined.FavoriteBorder,
                contentDescription = "Like comentario",
                tint = if (isLiked) Color.Red else Color.Gray,
                modifier = Modifier.size(14.dp)
            )
        }
    }
}