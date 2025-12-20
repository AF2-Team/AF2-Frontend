package com.dev.af2.features.auth.presentation.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
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

// Imports de tu proyecto
import com.dev.af2.features.auth.domain.Notification
import com.dev.af2.features.auth.domain.NotificationType
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.logo_watercolor // Avatar Placeholder
import androidx.compose.ui.tooling.preview.Preview

// Colores
private val ColorDarkText = Color(0xFF423646)
private val ColorAccent = Color(0xFFBCA1BD) // Tu color morado/rosa suave

@Composable
fun NotificationItem(
    notification: Notification,
    onItemClick: () -> Unit,
    onButtonClick: () -> Unit // Para seguir/dejar de seguir
) {
    val openSansFamily = getOpenSansFontFamily()

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onItemClick() }
            .padding(horizontal = 16.dp, vertical = 12.dp), // Espaciado cómodo
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {

        // --- IZQUIERDA: Avatar + Texto ---
        Row(
            modifier = Modifier.weight(1f), // Ocupa todo el espacio posible
            verticalAlignment = Alignment.CenterVertically
        ) {
            // 1. AVATAR
            Image(
                painter = painterResource(Res.drawable.logo_watercolor), // Placeholder
                contentDescription = null,
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(Color.LightGray),
                contentScale = ContentScale.Crop
            )

            Spacer(modifier = Modifier.width(12.dp))

            // 2. TEXTO (Username + Acción + Tiempo)
            Column {
                Text(
                    text = buildAnnotatedString {
                        // Nombre de usuario en Negrita
                        withStyle(style = SpanStyle(fontWeight = FontWeight.Bold, color = ColorDarkText)) {
                            append(notification.username)
                        }
                        append(" ")
                        // Acción según el tipo
                        val actionText = when (notification.type) {
                            NotificationType.LIKE -> "indicó que le gusta tu publicación."
                            NotificationType.COMMENT -> "comentó: \"${notification.contentPreview}\""
                            NotificationType.FOLLOW -> "comenzó a seguirte."
                            NotificationType.MENTION -> "te mencionó en un comentario."
                        }
                        withStyle(style = SpanStyle(color = ColorDarkText)) {
                            append(actionText)
                        }
                        // Tiempo (Color gris)
                        withStyle(style = SpanStyle(color = Color.Gray)) {
                            append("  ${notification.timeAgo}")
                        }
                    },
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontFamily = openSansFamily,
                        fontSize = 15.sp,
                        lineHeight = 20.sp
                    )
                )
            }
        }

        // --- DERECHA: Acción Secundaria (Botón o Foto) ---
        Spacer(modifier = Modifier.width(8.dp))

        if (notification.type == NotificationType.FOLLOW) {
            // Botón "Seguir" / "Siguiendo"
            Button(
                onClick = onButtonClick,
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (notification.isFollowing) Color.LightGray else ColorAccent,
                    contentColor = if (notification.isFollowing) Color.Black else Color.White
                ),
                shape = RoundedCornerShape(8.dp), // Bordes redondeados pero no pill completo
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 0.dp),
                modifier = Modifier.height(34.dp) // Altura compacta
            ) {
                Text(
                    text = if (notification.isFollowing) "Siguiendo" else "Seguir",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
            }
        } else if (notification.postImageUrl != null) {
            // Miniatura del Post (Like/Comment)
            Image(
                painter = painterResource(Res.drawable.logo_watercolor), // Placeholder del post
                contentDescription = "Post",
                modifier = Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(6.dp)) // Cuadrado redondeado
                    .background(Color.Gray),
                contentScale = ContentScale.Crop
            )
        }
    }
}