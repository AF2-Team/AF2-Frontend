package com.dev.af2.features.auth.presentation

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.FollowRepository
import com.dev.af2.features.auth.data.PostRepository
import com.dev.af2.features.auth.domain.Post
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class HomeUiState(
    val isLoading: Boolean = true, // Empieza cargando
    val posts: List<Post> = emptyList(),
    val error: String? = null
)

class HomeScreenModel : ScreenModel {
    private val repository = PostRepository()
    private val followRepository = FollowRepository()

    private val _state = MutableStateFlow(HomeUiState())
    val state = _state.asStateFlow()

    init {
        // Cargar posts automáticamente al iniciar
        loadPosts()
    }

    fun loadPosts() {
        screenModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            val result = repository.getPosts()

            result.onSuccess { posts ->
                _state.value = HomeUiState(isLoading = false, posts = posts)
            }.onFailure { e ->
                _state.value = HomeUiState(isLoading = false, error = e.message)
            }
        }
    }
    fun toggleFollow(userId: String) {
        // Función auxiliar para actualizar la lista (sirve para la actualización y para el rollback)
        fun updateListInState() {
            // 1. Obtenemos la lista actual
            val currentPosts = _state.value.posts

            // 2. Creamos la nueva lista modificada
            val updatedPosts = currentPosts.map { post ->
                if (post.author.id == userId) {
                    // Invertimos el valor de isFollowing
                    post.copy(author = post.author.copy(isFollowing = !post.author.isFollowing))
                } else {
                    post
                }
            }

            // 3. Actualizamos el estado con la nueva lista
            _state.value = _state.value.copy(posts = updatedPosts)
        }

        // --- PASO 1: Actualización Optimista (Visual inmediata) ---
        updateListInState()

        // --- PASO 2: Llamada al Backend ---
        screenModelScope.launch {
            followRepository.toggleFollow(userId)
                .onFailure {
                    // --- PASO 3: Si falla, revertimos el cambio (Rollback) ---
                    println("Error follow: ${it.message}")
                    updateListInState() // Volvemos a ejecutar para invertir de nuevo
                }
        }
    }

    fun toggleLike(postId: String) {
        val currentPosts = _state.value.posts

        // 1. Actualización Optimista (Calculamos el nuevo estado localmente)
        val optimizedPosts = currentPosts.map { post ->
            if (post.id == postId) {
                val newLiked = !post.isLiked
                // Si ahora es liked, sumamos 1. Si no, restamos 1.
                val newCount = if (newLiked) post.likesCount + 1 else maxOf(0, post.likesCount - 1)

                post.copy(isLiked = newLiked, likesCount = newCount)
            } else {
                post
            }
        }
        _state.value = _state.value.copy(posts = optimizedPosts)

        // 2. Llamada al API
        screenModelScope.launch {
            repository.toggleLike(postId)
                .onSuccess { response ->
                    // 3. Confirmación (Usamos el dato real del servidor si queremos ser precisos)
                    val confirmedPosts = _state.value.posts.map { post ->
                        if (post.id == postId) {
                            post.copy(isLiked = response.liked, likesCount = response.likesCount)
                        } else {
                            post
                        }
                    }
                    _state.value = _state.value.copy(posts = confirmedPosts)
                }
                .onFailure {
                    // 4. Rollback si falla
                    println("Error like: ${it.message}")
                    _state.value = _state.value.copy(posts = currentPosts) // Volvemos al original
                }
        }
    }
}