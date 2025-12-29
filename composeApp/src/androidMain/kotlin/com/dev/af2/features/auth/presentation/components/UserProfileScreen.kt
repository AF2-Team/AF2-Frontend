package com.dev.af2.features.auth.presentation.components


import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.GridOn
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import coil3.compose.AsyncImage
import org.jetbrains.compose.resources.painterResource

// Imports de tu proyecto
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import com.dev.af2.features.auth.data.PostRepository
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.image_profile
import af2.composeapp.generated.resources.image_post4
import af2.composeapp.generated.resources.logo_watercolor

// --- COLORES ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorAccent = Color(0xFFBCA1BD)
private val ColorBlue = Color(0xFF1DA1F2)

// Recibimos datos del usuario a visitar
data class UserProfilePage(
    val username: String,
    val userAvatar: String = "" // Opcional si ya la tienes
) : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        UserProfileScreen(
            username = username,
            userAvatar = userAvatar,
            onBackClick = { navigator.pop() },
            onPostClick = { postId -> println("Ver post $postId") }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserProfileScreen(
    username: String,
    userAvatar: String,
    onBackClick: () -> Unit,
    onPostClick: (String) -> Unit
) {
    val openSansFamily = getOpenSansFontFamily()

    // --- ESTADO (Simulado) ---
    var isFollowing by remember { mutableStateOf(false) }

    // Filtramos los posts de ESTE usuario específico
    val userPosts = remember(username) {
        PostRepository.posts.filter { it.username == username }
    }

    // Datos Mock del perfil visitado
    val handle = "@${username.lowercase().replace(" ", "_")}"
    val bio = "Amante de la fotografía y el diseño. Viajando por el mundo 🌍"
    val followersCount = if (isFollowing) 1201 else 1200 // Simular cambio

    Box(modifier = Modifier.fillMaxSize().background(ColorBgWhite)) {

        // --- CAPA 1: CONTENIDO ---
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(1.dp),
            verticalArrangement = Arrangement.spacedBy(1.dp)
        ) {

            // ÍTEM 1: HEADER (Banner + Info)
            item(span = { GridItemSpan(3) }) {
                Column {
                    // --- BANNER Y AVATAR ---
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(240.dp)
                    ) {
                        // Banner (Estático por ahora, o podrías recibirlo)
                        Image(
                            painter = painterResource(Res.drawable.image_post4), // Banner genérico
                            contentDescription = "Banner",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(190.dp)
                                .align(Alignment.TopCenter)
                        )

                        // Sombra superior
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(80.dp)
                                .background(
                                    Brush.verticalGradient(
                                        colors = listOf(Color.Black.copy(alpha = 0.6f), Color.Transparent)
                                    )
                                )
                                .align(Alignment.TopCenter)
                        )

                        // Avatar (Sin opción de editar)
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(110.dp)
                                .align(Alignment.BottomCenter)
                        ) {
                            // Círculo blanco borde
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .clip(CircleShape)
                                    .background(ColorBgWhite)
                                    .padding(4.dp)
                            ) {
                                if (userAvatar.isNotEmpty()) {
                                    AsyncImage(
                                        model = userAvatar,
                                        contentDescription = "Perfil",
                                        modifier = Modifier.fillMaxSize().clip(CircleShape),
                                        contentScale = ContentScale.Crop
                                    )
                                } else {
                                    // Placeholder si no hay avatar
                                    Image(
                                        painter = painterResource(Res.drawable.logo_watercolor),
                                        contentDescription = "Perfil",
                                        modifier = Modifier.fillMaxSize().clip(CircleShape),
                                        contentScale = ContentScale.Crop
                                    )
                                }
                            }
                        }
                    }

                    // --- INFO DEL USUARIO ---
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Spacer(modifier = Modifier.height(8.dp))

                        // Nombre
                        Text(
                            text = username,
                            style = MaterialTheme.typography.headlineSmall.copy(
                                fontFamily = openSansFamily,
                                fontWeight = FontWeight.Bold,
                                color = ColorDarkText
                            )
                        )
                        // Handle
                        Text(
                            text = handle,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = FontWeight.SemiBold,
                                color = Color.Gray
                            )
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        // Bio
                        Text(
                            text = bio,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                color = ColorDarkText,
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                                lineHeight = 20.sp
                            ),
                            modifier = Modifier.padding(horizontal = 24.dp)
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // --- BOTONES DE ACCIÓN (Seguir / Mensaje) ---
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            // Botón Seguir
                            Button(
                                onClick = { isFollowing = !isFollowing },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isFollowing) Color.Transparent else ColorAccent,
                                    contentColor = if (isFollowing) ColorAccent else Color.White
                                ),
                                border = if (isFollowing) androidx.compose.foundation.BorderStroke(1.dp, ColorAccent) else null,
                                shape = RoundedCornerShape(20.dp),
                                modifier = Modifier.height(36.dp),
                                contentPadding = PaddingValues(horizontal = 24.dp)
                            ) {
                                Text(
                                    text = if (isFollowing) "Siguiendo" else "Seguir",
                                    fontWeight = FontWeight.Bold
                                )
                            }

                            // Botón Mensaje
                            Button(
                                onClick = { /* Ir a chat */ },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color.Transparent,
                                    contentColor = ColorDarkText
                                ),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color.LightGray),
                                shape = RoundedCornerShape(20.dp),
                                modifier = Modifier.height(36.dp),
                                contentPadding = PaddingValues(horizontal = 24.dp)
                            ) {
                                Text("Mensaje", fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        // Estadísticas
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            StatItem(count = userPosts.size.toString(), label = "Posts")
                            StatItem(count = followersCount.toString(), label = "Seguidores")
                            StatItem(count = "342", label = "Seguidos")
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Icono Grid (Visual)
                        Icon(
                            imageVector = Icons.Default.GridOn,
                            contentDescription = null,
                            tint = ColorAccent,
                            modifier = Modifier.size(28.dp)
                        )
                        HorizontalDivider(
                            color = ColorAccent.copy(alpha = 0.3f),
                            modifier = Modifier.padding(top = 8.dp, bottom = 2.dp)
                        )
                    }
                }
            }

            // ÍTEMS: GRID DE FOTOS
            if (userPosts.isEmpty()) {
                item(span = { GridItemSpan(3) }) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("Este usuario aún no tiene publicaciones", color = Color.Gray)
                    }
                }
            } else {
                items(userPosts) { post ->
                    Box(
                        modifier = Modifier
                            .aspectRatio(1f)
                            .background(Color.LightGray)
                            .clickable { onPostClick(post.id) }
                    ) {
                        if (post.imageUrl.isNotEmpty()) {
                            AsyncImage(
                                model = post.imageUrl,
                                contentDescription = null,
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )
                        } else {
                            // Placeholder
                            Image(
                                painter = painterResource(Res.drawable.logo_watercolor),
                                contentDescription = null,
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )
                        }
                    }
                }
            }
        }

        // --- CAPA 2: TOP APP BAR TRANSPARENTE ---
        CenterAlignedTopAppBar(
            title = { },
            navigationIcon = {
                IconButton(
                    onClick = onBackClick,
                    modifier = Modifier
                        .background(Color.Black.copy(alpha = 0.3f), CircleShape)
                        .size(40.dp)
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Atrás",
                        tint = Color.White
                    )
                }
            },
            actions = {
                // Menú de opciones (Reportar, Bloquear, etc.)
                IconButton(
                    onClick = { /* Menú */ },
                    modifier = Modifier
                        .padding(end = 8.dp)
                        .background(Color.Black.copy(alpha = 0.3f), CircleShape)
                        .size(40.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.MoreVert,
                        contentDescription = "Opciones",
                        tint = Color.White
                    )
                }
            },
            colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                containerColor = Color.Transparent,
                scrolledContainerColor = Color.Transparent
            ),
            modifier = Modifier.align(Alignment.TopCenter)
        )
    }
}

@Composable
private fun StatItem(count: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = count,
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.Bold,
                color = ColorDarkText
            )
        )
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray)
        )
    }
}