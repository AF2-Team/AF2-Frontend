package com.dev.af2.features.auth.presentation.components


import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Tag
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// --- COLORES ---
private val ColorDarkText = Color(0xFF423646)
private val ColorGrayText = Color(0xFF888888)
private val ColorInputBg = Color(0xFFFAF7F7)
private val ColorAccent = Color(0xFFBCA1BD) // Color de la marca para el botón "Seguir"

// --- 1. MODELO DE DATOS (Mock) ---
data class Tag(
    val id: String,
    val name: String,
    val postsCount: Int,
    val isFollowing: Boolean = false
)

// --- 2. REPOSITORIO MOCK (Para mantener el estado durante la sesión) ---
object TagRepository {
    // Usamos mutableStateListOf para que la UI reaccione a los cambios
    private val _tags = mutableStateListOf(
        Tag("1", "fantasia", 12500, false),
        Tag("2", "accion", 8400, true),
        Tag("3", "fotografia", 45000, false),
        Tag("4", "arte", 3200, false),
        Tag("5", "viajes", 15600, true),
        Tag("6", "tecnologia", 9800, false),
        Tag("7", "diseño", 5400, false)
    )
    val tags: List<Tag> get() = _tags

    fun toggleFollow(tagId: String) {
        val index = _tags.indexOfFirst { it.id == tagId }
        if (index != -1) {
            val currentTag = _tags[index]
            // Creamos una copia con el estado invertido y actualizamos la lista
            _tags[index] = currentTag.copy(isFollowing = !currentTag.isFollowing)
        }
    }
}

// --- 3. COMPONENTE PRINCIPAL DE LA SECCIÓN ---
@Composable
fun SearchTagsSection(
    onTagClick: (String) -> Unit
) {
    val tags = TagRepository.tags

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        items(tags) { tag ->
            TagListItem(
                tag = tag,
                onClick = { onTagClick(tag.name) },
                onFollowClick = { TagRepository.toggleFollow(tag.id) }
            )
            HorizontalDivider(color = Color.LightGray.copy(alpha = 0.3f), thickness = 0.5.dp)
        }
    }
}

// --- 4. ÍTEM INDIVIDUAL DE ETIQUETA ---
@Composable
private fun TagListItem(
    tag: Tag,
    onClick: () -> Unit,
    onFollowClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        // IZQUIERDA: Icono + Nombre + Contador
        Row(verticalAlignment = Alignment.CenterVertically) {
            // Icono de Hash en círculo
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(ColorInputBg),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Tag,
                    contentDescription = null,
                    tint = ColorDarkText,
                    modifier = Modifier.size(24.dp)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column {
                Text(
                    text = "#${tag.name}",
                    style = MaterialTheme.typography.bodyLarge.copy(
                        fontWeight = FontWeight.Bold,
                        color = ColorDarkText
                    )
                )
                Text(
                    text = "${formatCount(tag.postsCount)} publicaciones",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = ColorGrayText,
                        fontSize = 13.sp
                    )
                )
            }
        }

        // DERECHA: Botón Seguir/Siguiendo
        FollowButton(isFollowing = tag.isFollowing, onClick = onFollowClick)
    }
}

// Componente de Botón de Seguir
@Composable
private fun FollowButton(
    isFollowing: Boolean,
    onClick: () -> Unit
) {
    // Configuración visual según el estado
    val containerColor = if (isFollowing) Color.Transparent else ColorAccent
    val contentColor = if (isFollowing) ColorAccent else Color.White
    val border = if (isFollowing) BorderStroke(1.dp, ColorAccent) else null
    val text = if (isFollowing) "Siguiendo" else "Seguir"

    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(
            containerColor = containerColor,
            contentColor = contentColor
        ),
        border = border,
        shape = RoundedCornerShape(20.dp),
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 0.dp),
        modifier = Modifier.height(36.dp)
    ) {
        Text(
            text = text,
            fontWeight = FontWeight.Bold,
            fontSize = 13.sp
        )
    }
}

// Helper simple para formatear números grandes (ej. 12.5k)
private fun formatCount(count: Int): String {
    return when {
        count >= 1000000 -> "${(count / 1000000.0).toString().take(3)}M"
        count >= 1000 -> "${(count / 1000.0).toString().take(4)}k"
        else -> count.toString()
    }
}
