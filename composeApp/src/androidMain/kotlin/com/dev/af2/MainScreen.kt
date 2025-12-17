package com.dev.af2
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChatBubbleOutline // O Email/Send
import androidx.compose.material.icons.filled.Home
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

// Importa tu HomeTab real
import com.dev.af2.features.auth.presentation.HomeTab
import com.dev.af2.features.auth.presentation.components.CustomTopBar


private val ColorTabBackground = Color(0xFF423646) // DeepPurple de tu paleta
private val ColorIconSelected = Color.White
private val ColorIconUnselected = Color.White.copy(alpha = 0.6f)
class MainScreen : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    override fun Content() {
        // Configuramos el TabNavigator con la pestaña inicial
        TabNavigator(HomeTab) {
            Scaffold(
                modifier = Modifier.fillMaxSize(),
                topBar = {
                    val tabNavigator = LocalTabNavigator.current
                    CustomTopBar(tabNavigator)
                },
                bottomBar = {
                    NavigationBar(
                        containerColor = ColorTabBackground,
                        tonalElevation = 0.dp,
                    ) {
                        // --- LOS 4 ÍCONOS ---
                        TabNavigationItem(HomeTab)
                        TabNavigationItem(SearchTab)
                        TabNavigationItem(NotificationsTab)
                        TabNavigationItem(MessagesTab)
                    }
                }

            ) { innerPadding ->
                Box(
                    modifier = Modifier.fillMaxSize()
                      //  .padding(innerPadding)
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
                    modifier = Modifier.size(32.dp),
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

// --- TABS (Placeholder para las pantallas que aún no creas) ---

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