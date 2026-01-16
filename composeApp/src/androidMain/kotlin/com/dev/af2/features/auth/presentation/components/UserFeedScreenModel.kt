package com.dev.af2.features.auth.presentation.components

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import com.dev.af2.features.auth.data.FavoriteRepository // [NUEVO] Importar Repo
import com.dev.af2.features.auth.data.FollowRepository
import com.dev.af2.features.auth.data.PostRepository
import com.dev.af2.features.auth.data.remote.User
import com.dev.af2.features.auth.domain.Post
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class UserFeedUiState(
    val isLoading: Boolean = true,
    val posts: List<Post> = emptyList(),
    val currentUser: User? = null,
    val error: String? = null
)

class UserFeedScreenModel(private val userId: String) : ScreenModel {
    private val postRepo = PostRepository()
    private val authRepo = AuthRepository()
    private val followRepo = FollowRepository()
    private val favoriteRepo = FavoriteRepository() // [NUEVO] Instancia del repo

    private val _state = MutableStateFlow(UserFeedUiState())
    val state = _state.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        screenModelScope.launch {
            // 1. Cargar quién soy yo (para saber si puedo borrar/editar)
            val me = authRepo.getMe().getOrNull()

            // 2. Cargar los posts del usuario seleccionado
            postRepo.getPostsByUser(userId)
                .onSuccess { posts ->
                    _state.value = UserFeedUiState(
                        isLoading = false,
                        posts = posts,
                        currentUser = me
                    )
                }
                .onFailure {
                    _state.value = _state.value.copy(isLoading = false, error = it.message)
                }
        }
    }

    // --- ACCIONES ---

    fun toggleLike(postId: String) {
        // Optimista
        val currentPosts = _state.value.posts
        val optimizedPosts = currentPosts.map { post ->
            if (post.id == postId) {
                val newLiked = !post.isLiked
                val newCount = if (newLiked) post.likesCount + 1 else maxOf(0, post.likesCount - 1)
                post.copy(isLiked = newLiked, likesCount = newCount)
            } else post
        }
        _state.value = _state.value.copy(posts = optimizedPosts)

        // API
        screenModelScope.launch {
            postRepo.toggleLike(postId).onFailure {
                // Revertir si falla
                _state.value = _state.value.copy(posts = currentPosts)
            }
        }
    }

    // [NUEVO] Función Toggle Favorite
    fun toggleFavorite(postId: String) {
        val currentPosts = _state.value.posts

        // 1. Optimismo: Actualizar UI al instante
        val optimizedPosts = currentPosts.map { post ->
            if (post.id == postId) {
                val wasFavorited = post.isFavorited
                post.copy(
                    isFavorited = !wasFavorited,
                    favoritesCount = if (wasFavorited) post.favoritesCount - 1 else post.favoritesCount + 1
                )
            } else {
                post
            }
        }
        _state.value = _state.value.copy(posts = optimizedPosts)

        // 2. Llamada a API
        screenModelScope.launch {
            val originalPost = currentPosts.find { it.id == postId }

            if (originalPost != null) {
                val result = if (originalPost.isFavorited) {
                    favoriteRepo.removeFavorite(postId)
                } else {
                    favoriteRepo.addFavorite(postId)
                }

                // 3. Rollback si falla
                result.onFailure {
                    println("Error favorite: ${it.message}")
                    _state.value = _state.value.copy(posts = currentPosts)
                }
            }
        }
    }

    fun deletePost(post: Post) {
        screenModelScope.launch {
            postRepo.deletePost(post.id).onSuccess {
                val newList = _state.value.posts.filter { it.id != post.id }
                _state.value = _state.value.copy(posts = newList)
            }
        }
    }

    fun updatePost(post: Post, newText: String) {
        screenModelScope.launch {
            postRepo.updatePost(post.id, newText).onSuccess { updatedPost ->
                val newList = _state.value.posts.map {
                    if (it.id == post.id) updatedPost else it
                }
                _state.value = _state.value.copy(posts = newList)
            }
        }
    }
}