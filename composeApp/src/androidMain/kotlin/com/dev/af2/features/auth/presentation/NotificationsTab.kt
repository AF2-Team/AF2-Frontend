package com.dev.af2.features.auth.presentation

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.NotificationsNone
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.rememberVectorPainter
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.navigator.tab.Tab
import cafe.adriel.voyager.navigator.tab.TabOptions

// Imports
import com.dev.af2.features.auth.domain.Notification
import com.dev.af2.features.auth.domain.NotificationType
import com.dev.af2.features.auth.presentation.components.NotificationItem
import com.dev.af2.core.designsystem.getOpenSansFontFamily

object NotificationsTab : Tab {

    override val options: TabOptions
        @Composable
        get() {
            val icon = rememberVectorPainter(Icons.Default.NotificationsNone)
            return remember { TabOptions(index = 2u, title = "Notificaciones", icon = icon) }
        }

    @Composable
    override fun Content() {
        val openSansFamily = getOpenSansFontFamily()

        // --- DATOS MOCK ---
        val todayNotifications = remember {
            listOf(
                Notification("1", "u1", "sofia_design", "", NotificationType.LIKE, "2h", postImageUrl = "url"),
                Notification("2", "u2", "carlos_dev", "", NotificationType.COMMENT, "4h", contentPreview = "¡Increíble trabajo! 🔥", postImageUrl = "url"),
                Notification("3", "u3", "maria_art", "", NotificationType.FOLLOW, "5h", isFollowing = false)
            )
        }

        val weekNotifications = remember {
            listOf(
                Notification("4", "u4", "john_doe", "", NotificationType.FOLLOW, "2d", isFollowing = true),
                Notification("5", "u5", "pixel_studio", "", NotificationType.LIKE, "3d", postImageUrl = "url"),
                Notification("6", "u6", "traveler_guy", "", NotificationType.MENTION, "5d", contentPreview = "@alex_dev mira esto", postImageUrl = "url")
            )
        }

        Scaffold(
            topBar = {
                // Título simple centrado o alineado a la izquierda
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White)
                        .padding(horizontal = 16.dp, vertical = 14.dp)
                ) {
                    Text(
                        text = "Notificaciones",
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontFamily = openSansFamily,
                            fontWeight = FontWeight.Bold,
                            fontSize = 24.sp,
                            color = Color.Black
                        )
                    )
                }
            },
            containerColor = Color.White
        ) { paddingValues ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                // SECCIÓN: HOY
                item { SectionHeader("Hoy") }

                items(todayNotifications) { item ->
                    NotificationItem(
                        notification = item,
                        onItemClick = { println("Click notif ${item.id}") },
                        onButtonClick = { println("Action notif ${item.id}") }
                    )
                }

                // SECCIÓN: ESTA SEMANA
                item { SectionHeader("Esta semana") }

                items(weekNotifications) { item ->
                    NotificationItem(
                        notification = item,
                        onItemClick = { println("Click notif ${item.id}") },
                        onButtonClick = { println("Action notif ${item.id}") }
                    )
                }
            }
        }
    }
}

// Helper para los títulos de sección (Sticky Header style)
@Composable
private fun SectionHeader(text: String) {
    val openSansFamily = getOpenSansFontFamily()

     // Importarlo si es necesario
    Text(
        text = text,
        style = MaterialTheme.typography.titleMedium.copy(
            // fontFamily = alegreyaFamily, // Opcional si quieres usar la fuente custom aquí
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = Color.Black
        ),
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(horizontal = 16.dp, vertical = 12.dp)
    )
}