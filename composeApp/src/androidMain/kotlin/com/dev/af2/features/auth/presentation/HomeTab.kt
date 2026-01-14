package com.dev.af2.features.auth.presentation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.*
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.rememberVectorPainter
import cafe.adriel.voyager.core.model.rememberScreenModel
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import cafe.adriel.voyager.navigator.tab.Tab
import cafe.adriel.voyager.navigator.tab.TabOptions
import com.dev.af2.features.auth.data.PostRepository
import com.dev.af2.features.auth.presentation.comments.CommentsPage

import com.dev.af2.features.auth.presentation.components.PostItem
import com.dev.af2.features.auth.presentation.profile.ProfilePage
import com.dev.af2.features.auth.presentation.screens.UserProfilePage


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

        val navigator = LocalNavigator.currentOrThrow
        val rootNavigator = navigator.parent ?: navigator
        val screenModel = rememberScreenModel { HomeScreenModel() }
        val state by screenModel.state.collectAsState()
        Box(modifier = Modifier.fillMaxSize()) {

            if (state.isLoading) {
                // ESTADO CARGANDO
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            } else if (state.error != null) {
                // ESTADO ERROR
                Text(text = "Error: ${state.error}", modifier = Modifier.align(Alignment.Center))
            } else {
                // ESTADO ÉXITO (Lista de Posts)
                LazyColumn(
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(state.posts) { post ->
                        PostItem(
                            post = post,
                            onLikeClick = { screenModel.toggleLike(post.id) },
                            onCommentClick = { rootNavigator.push(CommentsPage(post.id)) },
                            onShareClick = { println("Share post ${post.id}") },
                            onProfileClick = {
                                // Aquí usamos los datos reales del post
                                // Asumo que 'post.author.username' es la ruta correcta según tu modelo 'Post'
                                // Si tu modelo Post tiene el username directo en la raíz, úsalo.

                                val username = post.author.username // O post.username según tu modelo
                                val avatar = post.author.avatar     // O post.userAvatar

                                // Tu lógica de "Yo" o "Luis Carrillo" (cuidado con hardcodear nombres)
                                // Lo ideal sería comparar IDs: if (post.author.id == TokenManager.userId)
                                if (username == "Yo" || username == "Luis Carrillo") {
                                    rootNavigator.push(ProfilePage())
                                } else {
                                    rootNavigator.push(
                                        UserProfilePage(
                                            username = username,
                                            userAvatar = avatar ?: "" // Manejar nulos
                                        )
                                    )
                                }
                            },
                            onFollowClick = { userId ->
                                screenModel.toggleFollow(userId) // <--- Conectamos aquí
                            }
                        )
                    }
                }
            }
        }
} }