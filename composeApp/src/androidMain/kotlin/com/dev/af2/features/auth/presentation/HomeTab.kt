package com.dev.af2.features.auth.presentation

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.rememberVectorPainter
import cafe.adriel.voyager.navigator.tab.Tab
import cafe.adriel.voyager.navigator.tab.TabOptions


import com.dev.af2.features.auth.domain.Post
import com.dev.af2.features.auth.presentation.components.HomeHeader
import com.dev.af2.features.auth.presentation.components.PostItem



object HomeTab : Tab {

    // Configuración para el BottomBar
    override val options: TabOptions
        @Composable
        get() {
            val title = "Inicio"
            val icon = rememberVectorPainter(Icons.Default.Home)

            return remember {
                TabOptions(
                    index = 0u,
                    title = title,
                    icon = icon
                )
            }
        }

    @Composable
    override fun Content() {
        // Datos Mock (Simulando Backend)
        val posts = remember {
            listOf(
                Post("1", "alirio_dev", "", "", "Disfrutando de KMP! 🚀 #Kotlin #Dev", 120, 5),
                Post("2", "design_pro", "", "", "Nuevo diseño disponible en Figma ✨", 85, 12),
                Post("3", "traveler_ve", "", "", "Los atardeceres de Barquisimeto son únicos 🌅", 340, 45, isLiked = true),
            )
        }

        Scaffold(
            topBar = {
                HomeHeader(
                    onInicioClick = {},
                    onEtiquetasClick = {}
                )
            }
        ) { paddingValues ->
            LazyColumn(
                modifier = Modifier.padding(paddingValues)
            ) {
                items(posts) { post ->
                    PostItem(
                        post = post,
                        onLikeClick = { println("Like post ${post.id}") },
                        onCommentClick = { println("Comment post ${post.id}") },
                        onShareClick = { println("Share post ${post.id}") },
                        onProfileClick = { println("Profile ${post.username}") }
                    )
                }
            }
        }
    }
}