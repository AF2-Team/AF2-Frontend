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
import com.dev.af2.features.auth.data.PostRepository

import com.dev.af2.features.auth.presentation.components.PostItem



class HomeTab : Tab {

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
        val posts = PostRepository.posts
        LazyColumn(
                modifier = Modifier
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