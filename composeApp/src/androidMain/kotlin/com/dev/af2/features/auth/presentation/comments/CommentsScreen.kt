package com.dev.af2.features.auth.presentation.comments


import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow

// Imports
import com.dev.af2.features.auth.domain.Comment
import com.dev.af2.features.auth.presentation.components.CommentItem
import com.dev.af2.core.designsystem.getOpenSansFontFamily

// Colores
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorAccent = Color(0xFFBCA1BD)

// Argumento: postId para saber qué comentarios cargar
data class CommentsPage(val postId: String) : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        CommentsScreen(
            onBackClick = { navigator.pop() },
            postId = postId
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CommentsScreen(
    onBackClick: () -> Unit,
    postId: String
) {
    val openSansFamily = getOpenSansFontFamily()


    // Estado del input
    var commentText by remember { mutableStateOf("") }

    // Mock Data (Lista mutable para simular agregar)
    val comments = remember {
        mutableStateListOf(
            Comment("1", "sofia_design", "", "¡Me encanta esta foto! 😍", "2h", 12,isLiked = false),
            Comment("2", "carlos_dev", "", "El uso de colores es genial.", "5h", 3, true),
            Comment("3", "maria_art", "", "¿Dónde fue tomada?", "1d", 0,isLiked = false),
            Comment("4", "john_doe", "", "🔥", "2d", 1,isLiked = false)
        )
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        "Comentarios",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = ColorDarkText
                        )
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Atrás",
                            tint = ColorDarkText
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = ColorBgWhite)
            )
        },
        containerColor = ColorBgWhite,
        bottomBar = {
            // Barra de entrada de comentario
            Surface(
                tonalElevation = 8.dp,
                shadowElevation = 8.dp,
                color = Color.White
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                        .navigationBarsPadding() // Importante para no tapar con gestos
                        .imePadding(), // Sube con el teclado
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Avatar Usuario Actual (Mini)
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(Color.LightGray)
                    )

                    Spacer(modifier = Modifier.width(12.dp))

                    // Input
                    BasicTextField(
                        value = commentText,
                        onValueChange = { commentText = it },
                        modifier = Modifier
                            .weight(1f)
                            .height(40.dp)
                            .background(Color(0xFFF5F5F5), RoundedCornerShape(20.dp))
                            .padding(horizontal = 16.dp),
                        textStyle = TextStyle(fontSize = 14.sp, color = ColorDarkText),
                        singleLine = true,
                        cursorBrush = SolidColor(ColorAccent),
                        decorationBox = { innerTextField ->
                            Box(contentAlignment = Alignment.CenterStart) {
                                if (commentText.isEmpty()) {
                                    Text(
                                        "Agrega un comentario...",
                                        color = Color.Gray,
                                        fontSize = 14.sp
                                    )
                                }
                                innerTextField()
                            }
                        }
                    )

                    Spacer(modifier = Modifier.width(8.dp))

                    // Botón Publicar (Solo visible si hay texto)
                    if (commentText.isNotBlank()) {
                        IconButton(
                            onClick = {
                                // Agregar comentario mock
                                comments.add(
                                    Comment(
                                        id = System.currentTimeMillis().toString(),
                                        username = "Yo",
                                        userAvatar = "",
                                        text = commentText,
                                        timestamp = "Ahora"
                                    )
                                )
                                commentText = "" // Limpiar
                            },
                            modifier = Modifier.size(40.dp)
                        ) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.Send,
                                contentDescription = "Enviar",
                                tint = ColorAccent
                            )
                        }
                    }
                }
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(bottom = 16.dp)
        ) {
            items(comments) { comment ->
                CommentItem(
                    comment = comment,
                    onLikeClick = {  clickedComment ->
                        // 1. Encuentra el índice del comentario que fue clickeado en la lista.
                        val index = comments.indexOf(clickedComment)
                        if (index != -1) {
                            // 2. Crea una COPIA del comentario con la propiedad 'isLiked' invertida.
                            //    Nunca modifiques el estado directamente.
                            val updatedComment = clickedComment.copy(
                                isLiked = !clickedComment.isLiked,
                                // 3. (Opcional pero recomendado) Actualiza el contador de likes.
                                likesCount = if (!clickedComment.isLiked) clickedComment.likesCount + 1 else clickedComment.likesCount - 1
                            )
                            // 4. Reemplaza el comentario antiguo por el actualizado en la lista.
                            //    Como 'comments' es una lista mutable de estado, Compose detectará
                            //    este cambio y redibujará el item afectado.
                            comments[index] = updatedComment
                        } }
                )
            }
        }
    }
}