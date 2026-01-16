package com.dev.af2.features.auth.presentation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.*
import androidx.compose.runtime.* // Importante para mutableStateOf, remember, getValue, setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.rememberVectorPainter
import cafe.adriel.voyager.core.model.rememberScreenModel
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import cafe.adriel.voyager.navigator.tab.Tab
import cafe.adriel.voyager.navigator.tab.TabOptions

// Imports de tu proyecto
import com.dev.af2.features.auth.domain.Post
import com.dev.af2.features.auth.presentation.comments.CommentsPage
import com.dev.af2.features.auth.presentation.components.PostItem
import com.dev.af2.features.auth.presentation.profile.ProfilePage
import com.dev.af2.features.auth.presentation.screens.UserProfilePage // Asegúrate que este import sea correcto según tu estructura

class HomeTab : Tab {

    override val options: TabOptions
        @Composable
        get() {
            val title = "Inicio"
            val icon = rememberVectorPainter(Icons.Default.Home)
            return remember { TabOptions(index = 0u, title = title, icon = icon) }
        }

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        val rootNavigator = navigator.parent ?: navigator
        val screenModel = rememberScreenModel { HomeScreenModel() }
        val state by screenModel.state.collectAsState()

        // --- 1. VARIABLES DE ESTADO QUE FALTABAN ---
        var postToDelete by remember { mutableStateOf<Post?>(null) }
        var postToEdit by remember { mutableStateOf<Post?>(null) }
        var editContent by remember { mutableStateOf("") }

        Box(modifier = Modifier.fillMaxSize()) {

            if (state.isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            } else if (state.error != null) {
                Text(text = "Error: ${state.error}", modifier = Modifier.align(Alignment.Center))
            } else {
                LazyColumn(modifier = Modifier.fillMaxSize()) {
                    items(state.posts) { post ->
                        PostItem(
                            post = post,
                            // Pasamos el ID del usuario actual para saber si mostrar el menú
                            currentUserId = state.currentUser?.id,

                            onLikeClick = { screenModel.toggleLike(post.id) },
                            onCommentClick = { rootNavigator.push(CommentsPage(post.id)) },
                            onShareClick = { println("Share post ${post.id}") },

                            // Navegación al perfil
                            onProfileClick = {
                                val username = post.author.username
                                val avatar = post.author.avatar
                                // Lógica mejorada: Si el ID coincide con el mío, voy a mi perfil
                                if (state.currentUser?.id == post.author.id) {
                                    rootNavigator.push(ProfilePage()) // Tu perfil
                                } else {
                                    // Perfil de otro (asumiendo que UserProfilePage recibe username o id)
                                    rootNavigator.push(
                                        UserProfilePage(
                                            userId = post.id,
                                            username = username,
                                            userAvatar = avatar ?: "",
                                        )
                                    )
                                }
                            },
                            onFollowClick = { userId -> screenModel.toggleFollow(userId) },

                            // --- CONEXIÓN DE LOS CALLBACKS DE BORRAR/EDITAR ---
                            // Esto rellena las variables de estado declaradas arriba
                            onDeleteClick = { postToDelete = it },
                            onEditClick = {
                                postToEdit = it
                                editContent = it.text // Cargamos el texto actual para editar
                            }
                        )
                    }
                }
            }

            // --- 2. DIÁLOGOS (Overlay) ---

            // Diálogo de Confirmación de Eliminar
            if (postToDelete != null) {
                AlertDialog(
                    onDismissRequest = { postToDelete = null },
                    title = { Text("¿Eliminar publicación?") },
                    text = { Text("Esta acción no se puede deshacer.") },
                    confirmButton = {
                        TextButton(
                            onClick = {
                                screenModel.deletePost(postToDelete!!)
                                postToDelete = null
                            },
                            colors = ButtonDefaults.textButtonColors(contentColor = Color.Red)
                        ) { Text("Eliminar") }
                    },
                    dismissButton = {
                        TextButton(onClick = { postToDelete = null }) { Text("Cancelar") }
                    }
                )
            }

            // Diálogo de Edición
            if (postToEdit != null) {
                AlertDialog(
                    onDismissRequest = { postToEdit = null },
                    title = { Text("Editar publicación") },
                    text = {
                        OutlinedTextField(
                            value = editContent,
                            onValueChange = { editContent = it },
                            modifier = Modifier.fillMaxWidth(),
                            label = { Text("Texto") }
                        )
                    },
                    confirmButton = {
                        TextButton(
                            onClick = {
                                screenModel.updatePost(postToEdit!!, editContent)
                                postToEdit = null
                            }
                        ) { Text("Guardar") }
                    },
                    dismissButton = {
                        TextButton(onClick = { postToEdit = null }) { Text("Cancelar") }
                    }
                )
            }
        }
    }

    private fun HomeScreenModel.updatePost(
        postToEdit: com.dev.af2.features.auth.domain.Post,
        editContent: String
    ) {
    }
}