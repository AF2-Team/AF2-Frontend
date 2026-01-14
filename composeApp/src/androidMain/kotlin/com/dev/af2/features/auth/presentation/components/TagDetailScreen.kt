package com.dev.af2.features.auth.presentation.components


import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import kotlinx.coroutines.launch
import androidx.compose.ui.composed
import androidx.compose.ui.platform.debugInspectorInfo
import androidx.compose.foundation.pager.PagerState
import androidx.compose.ui.unit.Dp
import com.dev.af2.features.auth.data.PostRepository
import com.dev.af2.features.auth.presentation.components.PostItem
import com.dev.af2.core.designsystem.getAlegreyaFontFamily
import com.dev.af2.features.auth.presentation.components.SearchTagsSection
import kotlin.String
import kotlin.Unit
import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
// --- COLORES ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorAccent = Color(0xFFBCA1BD)

data class TagDetailPage(val tag: String) : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        TagDetailScreen(
            tag = tag,
            onBackClick = { navigator.pop() }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun TagDetailScreen(
    tag: String,
    onBackClick: () -> Unit
) {
    val alegreyaFamily = getAlegreyaFontFamily()
    val scope = rememberCoroutineScope()

    // Estados para el filtro
    var selectedFilter by remember { mutableStateOf("Populares") }
    var showFilterMenu by remember { mutableStateOf(false) }

    // Tabs
    val tabs = listOf("Publicaciones", "Etiquetas", "Perfiles")
    val pagerState = rememberPagerState(pageCount = { tabs.size })

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        "#$tag", // Nombre de la etiqueta
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontFamily = alegreyaFamily,
                            fontWeight = FontWeight.Bold,
                            color = ColorBgWhite
                        )
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Atrás",
                            tint = ColorBgWhite
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = ColorDarkText)
            )
        },
        containerColor = ColorBgWhite
    ) { paddingValues ->

        Column(modifier = Modifier.fillMaxSize().padding(top=paddingValues.calculateTopPadding())) {

            // --- TABS (SLIDERS) ---
            TabRow(
                selectedTabIndex = pagerState.currentPage,
                containerColor = ColorDarkText,
                contentColor = ColorAccent,
                indicator = { tabPositions ->
                    TabRowDefaults.SecondaryIndicator(
                        Modifier.tabIndicatorOffset(pagerState.currentPage, tabPositions),
                        color = ColorAccent
                    )
                },
                divider = { HorizontalDivider(color = Color.LightGray.copy(alpha = 0.5f)) }
            ) {
                tabs.forEachIndexed { index, title ->
                    Tab(
                        selected = pagerState.currentPage == index,
                        onClick = { scope.launch { pagerState.animateScrollToPage(index) } },
                        text = {
                            Text(
                                text = title,
                                fontSize = 13.sp,
                                fontWeight = if (pagerState.currentPage == index) FontWeight.Bold else FontWeight.Normal,
                                color = if (pagerState.currentPage == index) ColorAccent else Color.Gray
                            )
                        }
                    )
                }
            }

            // --- CONTENIDO DEL PAGER ---
            HorizontalPager(
                state = pagerState,
                modifier = Modifier.weight(1f)
            ) { page ->
                when (page) {
                    0 -> { // PUBLICACIONES
                        Column(modifier = Modifier.fillMaxSize()) {

                            // --- FILTRO (Solo en Publicaciones) ---
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 16.dp, vertical = 8.dp)
                            ) {
                                Button(
                                    onClick = { showFilterMenu = !showFilterMenu },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = Color(0xFFF5F5F5),
                                        contentColor = ColorDarkText
                                    ),
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                                    modifier = Modifier.height(32.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.FilterList,
                                        contentDescription = null,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "Ordenar por: $selectedFilter",
                                        fontSize = 12.sp
                                    )
                                }

                                // Menú Dropdown para el filtro
                                DropdownMenu(
                                    expanded = showFilterMenu,
                                    onDismissRequest = { showFilterMenu = false }
                                ) {
                                    DropdownMenuItem(
                                        text = { Text("Populares") },
                                        onClick = {
                                            selectedFilter = "Populares"
                                            showFilterMenu = false
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Recientes") },
                                        onClick = {
                                            selectedFilter = "Recientes"
                                            showFilterMenu = false
                                        }
                                    )
                                }
                            }

                            // --- LISTA DE POSTS (MOCK) ---
                            val posts = emptyList<com.dev.af2.features.auth.domain.Post>()
                            if (posts.isEmpty()) {
                                Box(
                                    modifier = Modifier.fillMaxSize().padding(32.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("No hay publicaciones con #$tag", color = Color.Gray)
                                }
                            } else {
                                LazyColumn(modifier = Modifier.fillMaxSize()) {
                                    items(posts) { post ->
                                        PostItem(
                                            post = post,
                                            onLikeClick = {},
                                            onCommentClick = {},
                                            onShareClick = {},
                                            onProfileClick = {},
                                            onFollowClick = {}
                                        )
                                    }
                                }
                            }
                        }
                    }
                    1 -> { // ETIQUETAS
                        SearchTagsSection(
                            onTagClick = {}
                        )
                    }
                    2 -> { // PERFILES
                        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            Text("Lista de Perfiles relacionados", color = Color.Gray)
                        }
                    }
                }
            }
        }
    }
}

// Helper para el indicador del TabRow (copia del ProfileScreen si no es global)

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