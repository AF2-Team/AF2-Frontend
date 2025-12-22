package com.dev.af2.features.auth.presentation.profile


import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AddAPhoto
import androidx.compose.material.icons.filled.GridOn
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

import androidx.compose.material.icons.filled.Settings
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.image_profile
import af2.composeapp.generated.resources.image_post4
import com.dev.af2.features.auth.data.PostRepository
import com.dev.af2.features.auth.presentation.settings.SettingsPage
// --- COLORES ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorAccent = Color(0xFFBCA1BD)

class ProfilePage : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        ProfileScreen(
            onBackClick = { navigator.pop() },
            onPostClick = { postId -> println("Ver detalle post: $postId") },
            onSettingsClick = { navigator.push(SettingsPage()) }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    onBackClick: () -> Unit,
    onPostClick: (String) -> Unit,
    onSettingsClick: () -> Unit
) {
    val openSansFamily = getOpenSansFontFamily()

    // Estados
    var profileImageUri by remember { mutableStateOf<Uri?>(null) }
    val username = "Luis Carrillo"
    val handle = "@Grindlow"
    val bio = "Mobile Developer | Kotlin Multiplatform Enthusiast 🚀"

    val myPosts = remember { PostRepository.posts.filter { it.username == "Yo" } }

    val photoLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia(),
        onResult = { uri -> if (uri != null) profileImageUri = uri }
    )

    // USAMOS UN BOX COMO RAIZ PARA SUPERPONER CAPAS
    Box(modifier = Modifier.fillMaxSize().background(ColorBgWhite)) {

        // --- CAPA 1: CONTENIDO CON SCROLL (FONDO) ---
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 16.dp), // Padding solo abajo
            horizontalArrangement = Arrangement.spacedBy(1.dp),
            verticalArrangement = Arrangement.spacedBy(1.dp)
        ) {

            // ÍTEM 1: HEADER COMPLETO (Banner + Avatar + Info)
            // span = { GridItemSpan(3) } hace que ocupe todo el ancho
            item(span = { GridItemSpan(3) }) {
                Column {
                    // --- ÁREA DEL BANNER Y AVATAR ---
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(240.dp) // Aumentamos altura para que cubra bien el TopBar
                    ) {
                        // 1. IMAGEN DEL BANNER (Ocupa todo el espacio superior)
                        Image(
                            painter = painterResource(Res.drawable.image_post4),
                            contentDescription = "Banner",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(190.dp) // El banner llega hasta aquí
                                .align(Alignment.TopCenter)
                        )

                        // Sombra degradada superior para que se vea el botón atrás
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

                        // 2. AVATAR (Superpuesto)
                        Box(
                            contentAlignment = Alignment.BottomEnd,
                            modifier = Modifier
                                .size(110.dp) // Un poco más grande
                                .align(Alignment.BottomCenter) // Alineado abajo del Box contenedor (240dp)
                                .offset(y = 0.dp)
                                .clickable {
                                    photoLauncher.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                                }
                        ) {
                            // Círculo blanco para el borde
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .clip(CircleShape)
                                    .background(ColorBgWhite) // Borde blanco falso
                                    .padding(4.dp) // Grosor del borde
                            ) {
                                if (profileImageUri != null) {
                                    AsyncImage(
                                        model = profileImageUri,
                                        contentDescription = "Perfil",
                                        modifier = Modifier.fillMaxSize().clip(CircleShape),
                                        contentScale = ContentScale.Crop
                                    )
                                } else {
                                    Image(
                                        painter = painterResource(Res.drawable.image_profile),
                                        contentDescription = "Perfil",
                                        modifier = Modifier.fillMaxSize().clip(CircleShape),
                                        contentScale = ContentScale.Crop
                                    )
                                }
                            }

                            // Icono editar
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .offset(x = (-4).dp, y = (-4).dp)
                                    .clip(CircleShape)
                                    .background(ColorAccent)
                                    .border(2.dp, ColorBgWhite, CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.AddAPhoto,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }

                    // --- INFO DEL PERFIL ---
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = username, // Nombre (Luis Carrillo)
                            style = MaterialTheme.typography.headlineSmall.copy(
                                fontFamily = openSansFamily,
                                fontWeight = FontWeight.Bold,
                                color = ColorDarkText
                            )
                        )
                        Text(
                            text = handle, // @Grindlow
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

                        Spacer(modifier = Modifier.height(24.dp))

                        // ESTADÍSTICAS
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            ProfileStat(count = myPosts.size.toString(), label = "Posts")
                            ProfileStat(count = "1.2k", label = "Seguidores")
                            ProfileStat(count = "450", label = "Seguidos")
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // BARRA DE PESTAÑAS (Icono Grid)
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
            if (myPosts.isEmpty()) {
                item(span = { GridItemSpan(3) }) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("Aún no tienes publicaciones", color = Color.Gray)
                    }
                }
            } else {
                items(myPosts) { post ->
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
                            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                                Text("IMG", color = Color.White)
                            }
                        }
                    }
                }
            }
        }

        // --- CAPA 2: TOP APP BAR TRANSPARENTE (FLOTANTE) ---
        CenterAlignedTopAppBar(
            title = {
                // Título vacío o puedes ponerlo visible solo al scrollear (lógica avanzada)
                // De momento vacío para ver el banner limpio
            },
            navigationIcon = {
                // Botón con fondo circular semitransparente para que se vea sobre cualquier imagen
                IconButton(
                    onClick = onBackClick,
                    modifier = Modifier
                        .background(Color.Black.copy(alpha = 0.3f), CircleShape)
                        .size(40.dp)
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Atrás",
                        tint = Color.White // Blanco para contrastar con el banner
                    )
                }
            },
            actions = {
                IconButton(
                    onClick = onSettingsClick,
                    modifier = Modifier
                        .padding(end = 8.dp) // Un poco de margen derecho
                        .background(Color.Black.copy(alpha = 0.3f), CircleShape)
                        .size(40.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Settings,
                        contentDescription = "Configuración",
                        tint = Color.White
                    )
                }
            },
            colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                containerColor = Color.Transparent, // ¡Transparente!
                scrolledContainerColor = Color.Transparent
            ),
            modifier = Modifier.align(Alignment.TopCenter) // Fijado arriba
        )
    }
}

@Composable
fun ProfileStat(count: String, label: String) {
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