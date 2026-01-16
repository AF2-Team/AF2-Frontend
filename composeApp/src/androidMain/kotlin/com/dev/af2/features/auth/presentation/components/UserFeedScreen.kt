package com.dev.af2.features.auth.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import cafe.adriel.voyager.core.model.rememberScreenModel
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow

// Imports de tu proyecto
import com.dev.af2.features.auth.domain.Post
import com.dev.af2.features.auth.presentation.comments.CommentsPage
import com.dev.af2.features.auth.presentation.profile.ProfilePage
import com.dev.af2.features.auth.presentation.screens.UserProfilePage

data class UserFeedScreen(
    val userId: String,
    val initialPostId: String
) : Screen {

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        val screenModel = rememberScreenModel { UserFeedScreenModel(userId) }
        val state by screenModel.state.collectAsState()

        // Estado para el scroll
        val listState = rememberLazyListState()

        // Variables para editar/borrar
        var postToDelete by remember { mutableStateOf<Post?>(null) }
        var postToEdit by remember { mutableStateOf<Post?>(null) }
        var editContent by remember { mutableStateOf("") }

        // --- EFECTO DE SCROLL AUTOMÁTICO ---
        // Se ejecuta cuando cargan los posts. Busca el índice del initialPostId y salta ahí.
        LaunchedEffect(state.posts) {
            if (state.posts.isNotEmpty()) {
                val index = state.posts.indexOfFirst { it.id == initialPostId }
                if (index >= 0) {
                    listState.scrollToItem(index)
                }
            }
        }

        Scaffold(
            topBar = {
                CenterAlignedTopAppBar(
                    title = { Text("Publicaciones", style = MaterialTheme.typography.titleMedium) },
                    navigationIcon = {
                        IconButton(onClick = { navigator.pop() }) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Atrás")
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                        containerColor = Color.White
                    )
                )
            }
        ) { padding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.White)
                    .padding(padding)
            ) {
                if (state.isLoading) {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                } else {
                    LazyColumn(
                        state = listState, // Vinculamos el estado del scroll
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(state.posts) { post ->
                            PostItem(
                                post = post,
                                currentUserId = state.currentUser?.id,
                                onLikeClick = { screenModel.toggleLike(post.id) },
                                onCommentClick = { navigator.push(CommentsPage(post.id)) },
                                onShareClick = { /* Compartir */ },
                                onProfileClick = {
                                    // Si toco el perfil aquí, voy al perfil (o vuelvo si ya estoy)
                                    // Como ya estamos en un feed filtrado de este usuario,
                                    // quizás solo quieras hacer pop() o navegar de nuevo.
                                    if (state.currentUser?.id == post.author.id) {
                                        navigator.push(ProfilePage())
                                    } else {
                                        navigator.push(
                                            UserProfilePage(
                                                userId = post.author.id,
                                                username = post.author.username
                                            )
                                        )
                                    }
                                },
                                onFollowClick = { /* Lógica de follow opcional aquí */ },
                                onDeleteClick = { postToDelete = it },
                                onEditClick = {
                                    postToEdit = it
                                    editContent = it.text
                                }
                            )
                        }
                    }
                }

                // --- DIÁLOGOS (Igual que en HomeTab) ---
                if (postToDelete != null) {
                    AlertDialog(
                        onDismissRequest = { postToDelete = null },
                        title = { Text("¿Eliminar?") },
                        text = { Text("No podrás deshacer esta acción.") },
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

                if (postToEdit != null) {
                    AlertDialog(
                        onDismissRequest = { postToEdit = null },
                        title = { Text("Editar") },
                        text = {
                            OutlinedTextField(
                                value = editContent,
                                onValueChange = { editContent = it },
                                modifier = Modifier.fillMaxWidth()
                            )
                        },
                        confirmButton = {
                            TextButton(onClick = {
                                screenModel.updatePost(postToEdit!!, editContent)
                                postToEdit = null
                            }) { Text("Guardar") }
                        },
                        dismissButton = { TextButton(onClick = { postToEdit = null }) { Text("Cancelar") } }
                    )
                }
            }
        }
    }
}