package com.dev.af2.features.auth.presentation.components

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

    // --- ACCIONES (Copiadas del Home para mantener consistencia) ---

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