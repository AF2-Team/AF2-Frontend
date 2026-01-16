package com.dev.af2.features.auth.presentation.screens

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
import androidx.compose.material.icons.filled.Star // [NUEVO] Importante para el icono
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
import cafe.adriel.voyager.core.model.rememberScreenModel
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import coil3.compose.AsyncImage
import org.jetbrains.compose.resources.painterResource

// Imports de tu proyecto
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import com.dev.af2.features.auth.presentation.comments.CommentsPage
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.image_post4
import af2.composeapp.generated.resources.logo_watercolor
import com.dev.af2.features.auth.presentation.components.UserFeedScreen
import com.dev.af2.features.auth.presentation.components.UserProfileScreenModel

// --- COLORES ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorAccent = Color(0xFFBCA1BD)

data class UserProfilePage(
    val userId: String,
    val username: String,
    val userAvatar: String = ""
) : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        val screenModel = rememberScreenModel { UserProfileScreenModel(userId) }

        UserProfileScreen(
            initialUsername = username,
            initialAvatar = userAvatar,
            screenModel = screenModel,
            onBackClick = { navigator.pop() },
            onPostClick = { postId ->
                navigator.push(
                    UserFeedScreen(
                        userId = userId,
                        initialPostId = postId
                    )
                )
            }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserProfileScreen(
    initialUsername: String,
    initialAvatar: String,
    screenModel: UserProfileScreenModel,
    onBackClick: () -> Unit,
    onPostClick: (String) -> Unit
) {
    val openSansFamily = getOpenSansFontFamily()
    val state by screenModel.state.collectAsState()

    val user = state.user
    val displayUsername = user?.username ?: initialUsername
    val displayName = user?.name ?: displayUsername
    val displayAvatar = user?.avatar ?: initialAvatar
    val bio = user?.bio ?: "Sin biografía"

    val postsCount = state.posts.size
    val followersCount = user?.followersCount ?: 0
    val followingCount = user?.followingCount ?: 0
    val isFollowing = state.isFollowing

    Box(modifier = Modifier.fillMaxSize().background(ColorBgWhite)) {

        if (state.isLoading && state.posts.isEmpty()) {
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.Center),
                color = ColorAccent
            )
        } else {
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
                            Image(
                                painter = painterResource(Res.drawable.image_post4),
                                contentDescription = "Banner",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(190.dp)
                                    .align(Alignment.TopCenter)
                            )

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

                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(110.dp)
                                    .align(Alignment.BottomCenter)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .clip(CircleShape)
                                        .background(ColorBgWhite)
                                        .padding(4.dp)
                                ) {
                                    if (displayAvatar.isNotEmpty()) {
                                        AsyncImage(
                                            model = displayAvatar,
                                            contentDescription = "Perfil",
                                            modifier = Modifier.fillMaxSize().clip(CircleShape),
                                            contentScale = ContentScale.Crop
                                        )
                                    } else {
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

                            Text(
                                text = displayName,
                                style = MaterialTheme.typography.headlineSmall.copy(
                                    fontFamily = openSansFamily,
                                    fontWeight = FontWeight.Bold,
                                    color = ColorDarkText
                                )
                            )
                            Text(
                                text = "@$displayUsername",
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color.Gray
                                )
                            )

                            Spacer(modifier = Modifier.height(8.dp))

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

                            // --- BOTONES ---
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Button(
                                    onClick = { screenModel.toggleFollow() },
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

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceEvenly
                            ) {
                                StatItem(count = postsCount.toString(), label = "Posts")
                                StatItem(count = followersCount.toString(), label = "Seguidores")
                                StatItem(count = followingCount.toString(), label = "Seguidos")
                            }

                            Spacer(modifier = Modifier.height(16.dp))

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
                if (state.posts.isEmpty()) {
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
                    items(state.posts) { post ->
                        val mainImage = post.media.firstOrNull()?.url ?: post.mediaUrl

                        Box(
                            modifier = Modifier
                                .aspectRatio(1f)
                                .background(Color.LightGray)
                                .clickable { onPostClick(post.id) }
                        ) {
                            if (!mainImage.isNullOrBlank()) {
                                AsyncImage(
                                    model = mainImage,
                                    contentDescription = null,
                                    modifier = Modifier.fillMaxSize(),
                                    contentScale = ContentScale.Crop
                                )
                            } else {
                                Box(
                                    modifier = Modifier.fillMaxSize().background(Color(0xFFEEEEEE)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = post.text.take(10),
                                        color = Color.Gray,
                                        fontSize = 10.sp
                                    )
                                }
                            }

                            // [NUEVO] INDICADOR DE FAVORITO
                            if (post.isFavorited) {
                                Box(
                                    modifier = Modifier
                                        .align(Alignment.TopEnd)
                                        .padding(6.dp)
                                        .background(Color.Black.copy(alpha = 0.4f), CircleShape)
                                        .padding(4.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Star,
                                        contentDescription = "Favorito",
                                        tint = Color(0xFFFFC107), // Dorado
                                        modifier = Modifier.size(12.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // TOP BAR TRANSPARENTE
        CenterAlignedTopAppBar(
            title = { },
            navigationIcon = {
                IconButton(
                    onClick = onBackClick,
                    modifier = Modifier
                        .padding(start = 8.dp)
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