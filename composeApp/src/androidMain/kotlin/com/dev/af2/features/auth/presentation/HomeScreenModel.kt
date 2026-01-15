package com.dev.af2.features.auth.presentation

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import com.dev.af2.features.auth.data.FollowRepository
import com.dev.af2.features.auth.data.PostRepository
import com.dev.af2.features.auth.data.remote.User
import com.dev.af2.features.auth.domain.Post
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class HomeUiState(
    val isLoading: Boolean = true,
    val posts: List<Post> = emptyList(),
    val error: String? = null,
    val currentUser: User? = null // [IMPORTANTE] Aquí se guarda quién soy yo
)

class HomeScreenModel : ScreenModel {
    // Asegúrate de que los nombres de los métodos en tus Repos coincidan
    private val repository = PostRepository()
    private val followRepository = FollowRepository()
    private val authRepository = AuthRepository()

    private val _state = MutableStateFlow(HomeUiState())
    val state = _state.asStateFlow()

    init {
        loadData()
    }

    // [MODIFICADO] Ahora carga el Usuario Y los Posts
    fun loadData() {
        screenModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            // 1. Obtenemos el usuario actual (para saber qué posts son míos)
            // Si tu AuthRepository no tiene getMe(), usa getProfile() o similar
            val currentUserResult = authRepository.getMe()
            val myUser = currentUserResult.getOrNull()

            // 2. Obtenemos los posts (Feed)
            // Nota: En pasos anteriores llamamos a esto getFeed(), aquí usas getPosts().
            // Asegúrate de que coincida con tu PostRepository.
            val postsResult = repository.getPosts()

            postsResult.onSuccess { posts ->
                _state.value = HomeUiState(
                    isLoading = false,
                    posts = posts,
                    currentUser = myUser // Guardamos el usuario
                )
            }.onFailure { e ->
                _state.value = HomeUiState(
                    isLoading = false,
                    error = e.message,
                    currentUser = myUser // Aún si falla el feed, guardamos el usuario si cargó
                )
            }
        }
    }

    // [NUEVO] Eliminar Post
    fun deletePost(post: Post) {
        screenModelScope.launch {
            repository.deletePost(post.id).onSuccess {
                // Actualización visual inmediata: Quitamos el post de la lista
                val newList = _state.value.posts.filter { it.id != post.id }
                _state.value = _state.value.copy(posts = newList)
            }.onFailure {
                println("Error eliminando post: ${it.message}")
                // Opcional: Mostrar error en un Snackbar state
            }
        }
    }

    // [NUEVO] Editar Post
    fun updatePost(post: Post, newText: String) {
        screenModelScope.launch {
            repository.updatePost(post.id, newText).onSuccess { updatedPost ->
                // Actualización visual: Reemplazamos el viejo por el nuevo
                val newList = _state.value.posts.map {
                    if (it.id == post.id) updatedPost else it
                }
                _state.value = _state.value.copy(posts = newList)
            }.onFailure {
                println("Error actualizando post: ${it.message}")
            }
        }
    }

    // --- TUS FUNCIONES ORIGINALES (INTACTAS) ---

    fun toggleFollow(userId: String) {
        fun updateListInState() {
            val currentPosts = _state.value.posts
            val updatedPosts = currentPosts.map { post ->
                if (post.author.id == userId) {
                    post.copy(author = post.author.copy(isFollowing = !post.author.isFollowing))
                } else {
                    post
                }
            }
            _state.value = _state.value.copy(posts = updatedPosts)
        }

        updateListInState()

        screenModelScope.launch {
            followRepository.toggleFollow(userId)
                .onFailure {
                    println("Error follow: ${it.message}")
                    updateListInState()
                }
        }
    }

    fun toggleLike(postId: String) {
        val currentPosts = _state.value.posts

        // Optimista
        val optimizedPosts = currentPosts.map { post ->
            if (post.id == postId) {
                val newLiked = !post.isLiked
                val newCount = if (newLiked) post.likesCount + 1 else maxOf(0, post.likesCount - 1)
                post.copy(isLiked = newLiked, likesCount = newCount)
            } else {
                post
            }
        }
        _state.value = _state.value.copy(posts = optimizedPosts)

        // API
        screenModelScope.launch {
            repository.toggleLike(postId)
                .onSuccess { response ->
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
                    println("Error like: ${it.message}")
                    _state.value = _state.value.copy(posts = currentPosts)
                }
        }
    }
}