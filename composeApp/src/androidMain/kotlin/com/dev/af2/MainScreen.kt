package com.dev.af2
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChatBubbleOutline // O Email/Send
import androidx.compose.material.icons.filled.NotificationsNone // O FavoriteBorder
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.rememberVectorPainter
import androidx.compose.ui.unit.dp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.tab.CurrentTab
import cafe.adriel.voyager.navigator.tab.LocalTabNavigator
import cafe.adriel.voyager.navigator.tab.Tab
import cafe.adriel.voyager.navigator.tab.TabNavigator
import cafe.adriel.voyager.navigator.tab.TabOptions
import androidx.compose.runtime.remember
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.animation.shrinkVertically
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.expandVertically
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.requiredHeight
import androidx.compose.material.icons.filled.AddBox
import androidx.compose.runtime.LaunchedEffect
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import androidx.compose.material.icons.filled.Add
import androidx.compose.ui.focus.focusModifier
import androidx.compose.ui.graphics.Shape
import com.dev.af2.features.auth.presentation.HomeTab
import com.dev.af2.features.auth.presentation.components.CustomTopBar
import com.dev.af2.features.auth.presentation.NotificationsTab
import com.dev.af2.features.auth.presentation.MessagesTab
import com.dev.af2.features.auth.presentation.components.CreatePostPage

private val ColorTabBackground = Color(0xFF423646) // DeepPurple de tu paleta
private val ColorIconSelected = Color.White
private val ColorIconUnselected = Color.White.copy(alpha = 0.6f)
private val ColorBlue = Color(0xFF1DA1F2)
class MainScreen : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    override fun Content() {

        val rootNavigator = LocalNavigator.currentOrThrow

        val scrollBehavior = TopAppBarDefaults.enterAlwaysScrollBehavior()
        val isBottomBarVisible by remember {
            derivedStateOf { scrollBehavior.state.heightOffset > -10f }
        }


        // Configuramos el TabNavigator con la pestaña inicial
        TabNavigator(HomeTab()) {
            Scaffold(
                modifier = Modifier
                    .fillMaxSize()
                    .nestedScroll(scrollBehavior.nestedScrollConnection),
                topBar = {
                    val tabNavigator = LocalTabNavigator.current
                    CustomTopBar(tabNavigator, scrollBehavior)
                },
                floatingActionButton = {
                    // Solo mostramos el FAB si la barra de abajo es visible (opcional)
                    AnimatedVisibility(
                        visible = isBottomBarVisible,
                        enter = fadeIn(),
                        exit = fadeOut()
                    ) {
                        FloatingActionButton(
                            onClick = {
                                // Navegamos usando el rootNavigator
                                rootNavigator.push(CreatePostPage())
                            },
                            containerColor = ColorBlue, // Azul
                            contentColor = Color.White,
                            shape = MaterialTheme.shapes.medium, // Redondo
                            modifier = Modifier.size(56.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Add,
                                contentDescription = "Crear Post",
                                modifier = Modifier.size(24.dp)
                            )
                        }
                    }
                },
                bottomBar = {
                    AnimatedVisibility (
                        visible = isBottomBarVisible,
                        enter = slideInVertically { it } + expandVertically() + fadeIn(),
                        exit = slideOutVertically { it } + shrinkVertically() + fadeOut()
                    ){
                    NavigationBar(
                        modifier = Modifier.fillMaxWidth().requiredHeight(100.dp),
                        containerColor = ColorTabBackground,
                        tonalElevation = 0.dp,
                    ) {
                        // --- LOS 4 ÍCONOS ---
                        TabNavigationItem(HomeTab())
                        TabNavigationItem(SearchTab)
                        TabNavigationItem(NotificationsTab)
                        TabNavigationItem(MessagesTab)
                    }}
                }

            ) { innerPadding ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(innerPadding)
                ){
                    CurrentTab()
                }
            }
        }
    }
}

// --- Helper para los Items del BottomBar (Estilo Minimalista) ---
@Composable
private fun RowScope.TabNavigationItem(tab: Tab) {
    val tabNavigator = LocalTabNavigator.current
    val isSelected = tabNavigator.current == tab

    NavigationBarItem(
        selected = isSelected,
        onClick = { tabNavigator.current = tab },
        icon = {
            tab.options.icon?.let { iconPainter ->
                Icon(
                    painter = iconPainter,
                    contentDescription = tab.options.title,
                    modifier = Modifier.size(20.dp),
                    // Color dinámico: Rosa/Morado si seleccionado, Gris oscuro si no
                    tint = if (isSelected) ColorIconSelected else ColorIconUnselected
                )
            }
        },
        colors = NavigationBarItemDefaults.colors(
            indicatorColor = Color.Transparent // Quitamos la "burbuja" de fondo de Material3
        ),
        alwaysShowLabel = false // Solo íconos
    )
}

class AddPostTab : Tab {
    override val options: TabOptions
        @Composable
        get() {
            val title = "Crear"
            // Usa el icono de "Más" o "Cámara"
            val icon = rememberVectorPainter(Icons.Default.AddBox) // O AddCircleOutline
            return remember { TabOptions(index = 2u, title = title, icon = icon) }
        }

    @Composable
    override fun Content() {
        // Obtenemos el navegador raíz (el padre del TabNavigator)
        val tabNavigator = LocalTabNavigator.current
        val rootNavigator = LocalNavigator.currentOrThrow

        // <<--- LA MAGIA ESTÁ AQUÍ --- >>
        // Usamos LaunchedEffect para que esta acción se ejecute solo una vez
        // cuando el usuario navega a esta pestaña.
        LaunchedEffect(Unit) {
            // 1. LANZAMOS la CreatePostPage a la pila de navegación principal.
            rootNavigator.push(CreatePostPage())

            // 2. INMEDIATAMENTE DESPUÉS, volvemos a la pestaña anterior (HomeTab).
            // Esto evita que la pestaña "Add" se quede seleccionada con una pantalla en blanco.
            tabNavigator.current = HomeTab() // O la pestaña que consideres tu "feed" principal
        }
    }
}

// --- TABS (Placeholder para las pantallas que aún estan) ---

// 1. Búsqueda
object SearchTab : Tab {
    override val options: TabOptions
        @Composable
        get() {
            val title = "Buscar"
            val icon = rememberVectorPainter(Icons.Default.Search)
            return remember { TabOptions(index = 1u, title = title, icon = icon) }
        }

    @Composable
    override fun Content() {
        // Aquí iría tu SearchScreen() real
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = androidx.compose.ui.Alignment.Center) {
            Text("Pantalla de Búsqueda")
        }
    }
}

// 2. Notificaciones (Campana o Corazón según diseño)
object NotificationsTab : Tab {
    override val options: TabOptions
        @Composable
        get() {
            val title = "Notificaciones"
            // Usamos NotificationsNone (campana vacía) o FavoriteBorder (corazón)
            val icon = rememberVectorPainter(Icons.Default.NotificationsNone)
            return remember { TabOptions(index = 2u, title = title, icon = icon) }
        }

    @Composable
    override fun Content() {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = androidx.compose.ui.Alignment.Center) {
            Text("Pantalla de Notificaciones")
        }
    }
}

// 3. Mensajería (Chat)
object MessagesTab : Tab {
    override val options: TabOptions
        @Composable
        get() {
            val title = "Mensajes"
            // ChatBubbleOutline es un globo de texto clásico
            val icon = rememberVectorPainter(Icons.Default.ChatBubbleOutline)
            return remember { TabOptions(index = 3u, title = title, icon = icon) }
        }

    @Composable
    override fun Content() {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = androidx.compose.ui.Alignment.Center) {
            Text("Pantalla de Mensajes")
        }
    }
}