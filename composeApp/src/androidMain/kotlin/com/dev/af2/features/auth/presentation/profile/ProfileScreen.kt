package com.dev.af2.features.auth.presentation.profile

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
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AddAPhoto
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.GridOn
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.debugInspectorInfo
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
import kotlinx.coroutines.launch
import org.jetbrains.compose.resources.painterResource

// Imports de tu proyecto
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import com.dev.af2.features.auth.domain.Post
import com.dev.af2.features.auth.presentation.settings.SettingsPage
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.image_profile
import af2.composeapp.generated.resources.image_post4
import com.dev.af2.features.auth.data.remote.User

// --- COLORES ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorAccent = Color(0xFFBCA1BD)

class ProfilePage : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        // 1. Obtenemos el ViewModel
        val screenModel = rememberScreenModel { ProfileScreenModel() }
        val state by screenModel.state.collectAsState()

        ProfileScreen(
            user = state.user,
            isLoading = state.isLoading,
            error = state.error,
            onBackClick = { navigator.pop() },
            onPostClick = { postId -> println("Ver detalle post: $postId") },
            onSettingsClick = { navigator.push(SettingsPage()) },
            onRetry = { screenModel.fetchProfile() }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun ProfileScreen(
    user: User?,
    isLoading: Boolean,
    error: String?,
    onBackClick: () -> Unit,
    onPostClick: (String) -> Unit,
    onSettingsClick: () -> Unit,
    onRetry: () -> Unit
) {
    val openSansFamily = getOpenSansFontFamily()
    val scope = rememberCoroutineScope()

    // Estados de Perfil (Imagen local temporal)
    var profileImageUri by remember { mutableStateOf<Uri?>(null) }

    // Listas vacías (Placeholder hasta conectar endpoint de posts)
    val myPosts = remember { emptyList<Post>() }
    val savedPosts = remember { emptyList<Post>() }

    val photoLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia(),
        onResult = { uri -> if (uri != null) profileImageUri = uri }
    )

    // --- PAGER STATE ---
    val tabs = listOf(
        ProfileTabItem.Posts,
        ProfileTabItem.Saved,
        ProfileTabItem.Following,
        ProfileTabItem.Followers
    )
    val pagerState = rememberPagerState(pageCount = { tabs.size })

    Box(modifier = Modifier.fillMaxSize().background(ColorBgWhite)) {

        // 2. Manejo de Estados de Carga y Error
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.Center),
                color = ColorAccent
            )
        } else if (error != null) {
            Column(
                modifier = Modifier.align(Alignment.Center),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(text = "Error al cargar perfil", color = Color.Red)
                Text(text = error, fontSize = 12.sp, color = Color.Gray)
                Spacer(modifier = Modifier.height(8.dp))
                Button(onClick = onRetry, colors = ButtonDefaults.buttonColors(containerColor = ColorAccent)) {
                    Icon(Icons.Default.Refresh, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Reintentar")
                }
            }
        } else if (user != null) {
            // 3. Contenido Real del Perfil
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 16.dp)
            ) {

                // --- HEADER DEL PERFIL ---
                item {
                    Column {
                        // Banner + Avatar
                        Box(modifier = Modifier.fillMaxWidth().height(240.dp)) {
                            // Banner Estático (o user.banner si existiera)
                            Image(
                                painter = painterResource(Res.drawable.image_post4),
                                contentDescription = "Banner",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxWidth().height(190.dp).align(Alignment.TopCenter)
                            )
                            Box(
                                modifier = Modifier.fillMaxWidth().height(80.dp)
                                    .background(Brush.verticalGradient(colors = listOf(Color.Black.copy(alpha = 0.6f), Color.Transparent)))
                                    .align(Alignment.TopCenter)
                            )
                            Box(
                                contentAlignment = Alignment.BottomEnd,
                                modifier = Modifier.size(110.dp).align(Alignment.BottomCenter)
                                    .clickable { photoLauncher.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) }
                            ) {
                                Box(
                                    modifier = Modifier.fillMaxSize().clip(CircleShape).background(ColorBgWhite).padding(4.dp)
                                ) {
                                    // Lógica de visualización de Avatar
                                    // 1. URI Local (seleccionada ahora) -> 2. URL Backend -> 3. Placeholder
                                    val avatarModel = profileImageUri ?: user?.avatar

                                    if (avatarModel != null) {
                                        AsyncImage(
                                            model = avatarModel,
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
                                    modifier = Modifier.size(32.dp).offset(x = (-4).dp, y = (-4).dp).clip(CircleShape).background(ColorAccent).border(2.dp, ColorBgWhite, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.AddAPhoto, null, tint = Color.White, modifier = Modifier.size(16.dp))
                                }
                            }
                        }

                        // Info Texto (Datos Reales del Backend)
                        Column(
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Spacer(modifier = Modifier.height(8.dp))

                            // NOMBRE
                            Text(
                                text = user.name,
                                style = MaterialTheme.typography.headlineSmall.copy(fontFamily = openSansFamily, fontWeight = FontWeight.Bold, color = ColorDarkText)
                            )

                            // USERNAME
                            Text(
                                text = "@${user.username}",
                                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold, color = Color.Gray)
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            // BIOGRAFÍA
                            if (!user.bio.isNullOrBlank()) {
                                Text(
                                    text = user.bio,
                                    style = MaterialTheme.typography.bodyMedium.copy(color = ColorDarkText, textAlign = androidx.compose.ui.text.style.TextAlign.Center, lineHeight = 20.sp),
                                    modifier = Modifier.padding(horizontal = 24.dp)
                                )
                            } else {
                                Text(
                                    text = "Sin biografía",
                                    style = MaterialTheme.typography.bodySmall.copy(color = Color.LightGray)
                                )
                            }

                            Spacer(modifier = Modifier.height(16.dp))
                        }
                    }
                }

                // --- TABS ---
                item {
                    TabRow(
                        selectedTabIndex = pagerState.currentPage,
                        containerColor = ColorBgWhite,
                        contentColor = ColorAccent,
                        indicator = { tabPositions ->
                            TabRowDefaults.SecondaryIndicator(Modifier.tabIndicatorOffset(pagerState.currentPage, tabPositions), color = ColorAccent)
                        }
                    ) {
                        tabs.forEachIndexed { index, tabItem ->
                            Tab(
                                selected = pagerState.currentPage == index,
                                onClick = { scope.launch { pagerState.animateScrollToPage(index) } },
                                icon = { Icon(imageVector = tabItem.icon, contentDescription = tabItem.title, tint = if (pagerState.currentPage == index) ColorAccent else Color.Gray) }
                            )
                        }
                    }
                }

                // --- CONTENIDO DEL PAGER ---
                item {
                    Box(modifier = Modifier.height(500.dp)) {
                        HorizontalPager(state = pagerState, modifier = Modifier.fillMaxSize(), verticalAlignment = Alignment.Top) { page ->
                            when (tabs[page]) {
                                ProfileTabItem.Posts -> PostsGridSection(posts = myPosts, onPostClick = onPostClick)
                                ProfileTabItem.Saved -> PostsGridSection(posts = savedPosts, onPostClick = onPostClick)
                                // Pasamos contadores reales
                                ProfileTabItem.Following -> UserListSection(count = user.followingCount, type = "Siguiendo")
                                ProfileTabItem.Followers -> UserListSection(count = user.followersCount, type = "Seguidores")
                            }
                        }
                    }
                }
            }
        }

        // --- TOP BAR FLOTANTE (Se mantiene fija) ---
        CenterAlignedTopAppBar(
            title = { },
            navigationIcon = {
                IconButton(
                    onClick = onBackClick,
                    modifier = Modifier.background(Color.Black.copy(alpha = 0.3f), CircleShape).size(40.dp)
                ) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, "Atrás", tint = Color.White)
                }
            },
            actions = {
                IconButton(
                    onClick = onSettingsClick,
                    modifier = Modifier.padding(end = 8.dp).background(Color.Black.copy(alpha = 0.3f), CircleShape).size(40.dp)
                ) {
                    Icon(Icons.Default.Settings, "Configuración", tint = Color.White)
                }
            },
            colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = Color.Transparent, scrolledContainerColor = Color.Transparent),
            modifier = Modifier.align(Alignment.TopCenter)
        )
    }
}

// --- COMPONENTES AUXILIARES (Sin Cambios) ---

@Composable
fun PostsGridSection(
    posts: List<Post>,
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
                            Icon(Icons.Default.GridOn, null, tint = Color.Gray)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun UserListSection(count: Int, type: String) {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = count.toString(), style = MaterialTheme.typography.displayMedium.copy(fontWeight = FontWeight.Bold, color = ColorDarkText))
        Text(text = type, style = MaterialTheme.typography.titleMedium.copy(color = Color.Gray))
        Spacer(modifier = Modifier.height(16.dp))
        Text("(Lista de usuarios próximamente)", fontSize = 12.sp, color = Color.LightGray)
    }
}

sealed class ProfileTabItem(val icon: ImageVector, val title: String) {
    object Posts : ProfileTabItem(Icons.Default.GridOn, "Publicaciones")
    object Saved : ProfileTabItem(Icons.Default.BookmarkBorder, "Guardados")
    object Following : ProfileTabItem(Icons.Default.PersonAdd, "Siguiendo")
    object Followers : ProfileTabItem(Icons.Default.Group, "Seguidores")
}

fun Modifier.tabIndicatorOffset(currentTabPosition: Int, tabPositions: List<TabPosition>): Modifier = composed(
    inspectorInfo = debugInspectorInfo { name = "tabIndicatorOffset"; value = currentTabPosition }
) {
    val currentTabWidth = tabPositions[currentTabPosition].width
    val indicatorOffset = tabPositions[currentTabPosition].left
    fillMaxWidth().wrapContentSize(Alignment.BottomStart).offset(x = indicatorOffset).width(currentTabWidth)
}