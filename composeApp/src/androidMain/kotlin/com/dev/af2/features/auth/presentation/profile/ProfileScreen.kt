package com.dev.af2.features.auth.presentation.profile


import androidx.compose.ui.composed
import androidx.compose.ui.platform.debugInspectorInfo
import androidx.compose.ui.unit.Dp
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AddAPhoto
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.GridOn
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
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
import kotlinx.coroutines.launch
import org.jetbrains.compose.resources.painterResource

// Imports de tu proyecto
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import com.dev.af2.features.auth.data.PostRepository
import com.dev.af2.features.auth.presentation.settings.SettingsPage
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.image_profile
import af2.composeapp.generated.resources.image_post4

// --- COLORES ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorAccent = Color(0xFFBCA1BD)
private val ColorGrayText = Color(0xFF888888)

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

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun ProfileScreen(
    onBackClick: () -> Unit,
    onPostClick: (String) -> Unit,
    onSettingsClick: () -> Unit
) {
    val openSansFamily = getOpenSansFontFamily()
    val scope = rememberCoroutineScope()

    // Estados de Perfil
    var profileImageUri by remember { mutableStateOf<Uri?>(null) }
    val username = "Luis Carrillo"
    val handle = "@Grindlow"
    val bio = "Mobile Developer | Kotlin Multiplatform Enthusiast 🚀"

    // Datos
    val myPosts = remember { PostRepository.posts.filter { it.username == "Yo" } }
    // Mocks para otras pestañas (Favoritos, Seguidores...)
    val savedPosts = remember { PostRepository.posts.take(2) }
    val followersCount = 1200
    val followingCount = 450

    val photoLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia(),
        onResult = { uri -> if (uri != null) profileImageUri = uri }
    )

    // --- PAGER STATE ---
    // Definimos las 4 pestañas
    val tabs = listOf(
        ProfileTabItem.Posts,
        ProfileTabItem.Saved,
        ProfileTabItem.Following,
        ProfileTabItem.Followers
    )
    val pagerState = rememberPagerState(pageCount = { tabs.size })

    Box(modifier = Modifier.fillMaxSize().background(ColorBgWhite)) {

        // Usamos LazyColumn como contenedor principal para que toda la pantalla scrollee junta
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 16.dp)
        ) {

            // --- HEADER DEL PERFIL (Item 1) ---
            item {
                Column {
                    // Banner + Avatar
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

                        // Sombra superior para botones
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

                        // Avatar
                        Box(
                            contentAlignment = Alignment.BottomEnd,
                            modifier = Modifier
                                .size(110.dp)
                                .align(Alignment.BottomCenter)
                                .clickable {
                                    photoLauncher.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                                }
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .clip(CircleShape)
                                    .background(ColorBgWhite)
                                    .padding(4.dp)
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

                    // Info Texto
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = username,
                            style = MaterialTheme.typography.headlineSmall.copy(
                                fontFamily = openSansFamily,
                                fontWeight = FontWeight.Bold,
                                color = ColorDarkText
                            )
                        )
                        Text(
                            text = handle,
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
                    }
                }
            }

            // --- TABS (STICKY HEADER O SIMILAR) ---
            item {
                TabRow(
                    selectedTabIndex = pagerState.currentPage,
                    containerColor = ColorBgWhite,
                    contentColor = ColorAccent,
                    indicator = { tabPositions ->
                        TabRowDefaults.SecondaryIndicator(
                            Modifier.tabIndicatorOffset(pagerState.currentPage, tabPositions),
                            color = ColorAccent
                        )
                    }
                ) {
                    tabs.forEachIndexed { index, tabItem ->
                        Tab(
                            selected = pagerState.currentPage == index,
                            onClick = {
                                scope.launch { pagerState.animateScrollToPage(index) }
                            },
                            icon = {
                                Icon(
                                    imageVector = tabItem.icon,
                                    contentDescription = tabItem.title,
                                    tint = if (pagerState.currentPage == index) ColorAccent else Color.Gray
                                )
                            },
                            // Opcional: mostrar texto si quieres, por ahora solo icono es más limpio
                            // text = { Text(tabItem.title) }
                        )
                    }
                }
            }

            // --- CONTENIDO DEL PAGER (Item) ---
            item {
                // Calculamos una altura fija mínima para el pager o dejamos que crezca
                // En LazyColumn, items internos no pueden tener altura infinita.
                // Truco: Usamos un height fijo alto o una lógica de custom layout.
                // Para simplificar ahora, le daremos una altura fija grande,
                // o mejor, mostramos el contenido directamente según el estado sin Pager vertical.

                // NOTA: HorizontalPager dentro de LazyColumn puede ser conflictivo con gestos.
                // Sin embargo, para este diseño, funciona si la altura está definida.

                Box(modifier = Modifier.height(500.dp)) { // Altura arbitraria para el área de contenido
                    HorizontalPager(
                        state = pagerState,
                        modifier = Modifier.fillMaxSize(),
                        verticalAlignment = Alignment.Top
                    ) { page ->
                        when (tabs[page]) {
                            ProfileTabItem.Posts -> {
                                PostsGridSection(posts = myPosts, onPostClick = onPostClick)
                            }
                            ProfileTabItem.Saved -> {
                                PostsGridSection(posts = savedPosts, onPostClick = onPostClick)
                            }
                            ProfileTabItem.Following -> {
                                UserListSection(count = followingCount, type = "Siguiendo")
                            }
                            ProfileTabItem.Followers -> {
                                UserListSection(count = followersCount, type = "Seguidores")
                            }
                        }
                    }
                }
            }
        }

        // --- TOP BAR FLOTANTE ---
        CenterAlignedTopAppBar(
            title = { },
            navigationIcon = {
                IconButton(
                    onClick = onBackClick,
                    modifier = Modifier
                        .background(Color.Black.copy(alpha = 0.3f), CircleShape)
                        .size(40.dp)
                ) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, "Atrás", tint = Color.White)
                }
            },
            actions = {
                IconButton(
                    onClick = onSettingsClick,
                    modifier = Modifier
                        .padding(end = 8.dp)
                        .background(Color.Black.copy(alpha = 0.3f), CircleShape)
                        .size(40.dp)
                ) {
                    Icon(Icons.Default.Settings, "Configuración", tint = Color.White)
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

// --- COMPONENTES AUXILIARES ---

// 1. Grid de Posts (Reutilizable para Publicaciones y Favoritos)
@Composable
fun PostsGridSection(
    posts: List<com.dev.af2.features.auth.domain.Post>, // Asegúrate del import correcto
    onPostClick: (String) -> Unit
) {
    if (posts.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No hay publicaciones", color = Color.Gray)
        }
    } else {
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(1.dp),
            horizontalArrangement = Arrangement.spacedBy(1.dp),
            verticalArrangement = Arrangement.spacedBy(1.dp)
        ) {
            items(posts) { post ->
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
                        // Placeholder bonito
                        Box(
                            modifier = Modifier.fillMaxSize().background(Color(0xFFEEEEEE)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.GridOn, null, tint = Color.Gray)
                        }
                    }
                }
            }
        }
    }
}

// 2. Lista de Usuarios (Para Seguidores/Siguiendo) - Placeholder visual
@Composable
fun UserListSection(count: Int, type: String) {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = count.toString(),
            style = MaterialTheme.typography.displayMedium.copy(fontWeight = FontWeight.Bold, color = ColorDarkText)
        )
        Text(
            text = type,
            style = MaterialTheme.typography.titleMedium.copy(color = Color.Gray)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text("(Lista de usuarios próximamente)", fontSize = 12.sp, color = Color.LightGray)
    }
}

// 3. Definición de Tabs
sealed class ProfileTabItem(val icon: ImageVector, val title: String) {
    object Posts : ProfileTabItem(Icons.Default.GridOn, "Publicaciones")
    object Saved : ProfileTabItem(Icons.Default.BookmarkBorder, "Guardados")
    object Following : ProfileTabItem(Icons.Default.PersonAdd, "Siguiendo") // Icono aproximado
    object Followers : ProfileTabItem(Icons.Default.Group, "Seguidores")
}



fun Modifier.tabIndicatorOffset(
    currentTabPosition: Int,
    tabPositions: List<TabPosition>
): Modifier = composed(
    inspectorInfo = debugInspectorInfo {
        name = "tabIndicatorOffset"
        value = currentTabPosition
    }
) {
    val currentTabWidth = tabPositions[currentTabPosition].width
    val indicatorOffset = tabPositions[currentTabPosition].left
    fillMaxWidth()
        .wrapContentSize(Alignment.BottomStart)
        .offset(x = indicatorOffset)
        .width(currentTabWidth)
}