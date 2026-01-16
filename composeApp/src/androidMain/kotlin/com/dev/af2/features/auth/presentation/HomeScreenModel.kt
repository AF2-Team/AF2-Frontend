package com.dev.af2.features.auth.presentation

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import com.dev.af2.features.auth.data.FavoriteRepository
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
    val currentUser: User? = null
)

class HomeScreenModel : ScreenModel {
    private val repository = PostRepository()
    private val followRepository = FollowRepository()
    private val authRepository = AuthRepository()
    private val favoriteRepository = FavoriteRepository()

    private val _state = MutableStateFlow(HomeUiState())
    val state = _state.asStateFlow()

    init {
        loadData()
    }

    fun loadData() {
        screenModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            val currentUserResult = authRepository.getMe()
            val myUser = currentUserResult.getOrNull()

            val postsResult = repository.getPosts()

            postsResult.onSuccess { posts ->
                _state.value = HomeUiState(
                    isLoading = false,
                    posts = posts,
                    currentUser = myUser
                )
            }.onFailure { e ->
                _state.value = HomeUiState(
                    isLoading = false,
                    error = e.message,
                    currentUser = myUser
                )
            }
        }
    }

    fun deletePost(post: Post) {
        screenModelScope.launch {
            repository.deletePost(post.id).onSuccess {
                val newList = _state.value.posts.filter { it.id != post.id }
                _state.value = _state.value.copy(posts = newList)
            }.onFailure {
                println("Error eliminando post: ${it.message}")
            }
        }
    }

    fun updatePost(post: Post, newText: String) {
        screenModelScope.launch {
            repository.updatePost(post.id, newText).onSuccess { updatedPost ->
                val newList = _state.value.posts.map {
                    if (it.id == post.id) updatedPost else it
                }
                _state.value = _state.value.copy(posts = newList)
            }.onFailure {
                println("Error actualizando post: ${it.message}")
            }
        }
    }

    // --- CORRECCIÓN AQUÍ ---
    fun toggleFollow(userId: String) {
        val currentPosts = _state.value.posts

        // 1. Averiguamos el estado actual buscando cualquier post de ese usuario
        // (Si isFollowing es true, significa que lo queremos dejar de seguir)
        val isCurrentlyFollowing = currentPosts.find { it.author.id == userId }?.author?.isFollowing ?: false

        // Función auxiliar para actualizar visualmente todos los posts de ese autor
        fun updateState(isFollowingNow: Boolean) {
            val updatedPosts = _state.value.posts.map { post ->
                if (post.author.id == userId) {
                    // Actualizamos el estado isFollowing del autor dentro del post
                    post.copy(author = post.author.copy(isFollowing = isFollowingNow))
                } else {
                    post
                }
            }
            _state.value = _state.value.copy(posts = updatedPosts)
        }

        // 2. Optimista: Invertimos el estado visualmente YA
        updateState(!isCurrentlyFollowing)

        // 3. Llamada a la API correcta según el estado
        screenModelScope.launch {
            val result = if (isCurrentlyFollowing) {
                // Si ya lo seguía, llamamos a UNFOLLOW
                followRepository.unfollowUser(userId)
            } else {
                // Si no lo seguía, llamamos a FOLLOW
                followRepository.followUser(userId)
            }

            result.onFailure {
                println("Error al cambiar follow: ${it.message}")
                // 4. Si falla, revertimos al estado original (Rollback)
                updateState(isCurrentlyFollowing)
            }
        }
    }

    fun toggleLike(postId: String) {
        val currentPosts = _state.value.posts

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
    fun toggleFavorite(postId: String) {
        val currentPosts = _state.value.posts

        // 1. Optimismo: Actualizamos la UI inmediatamente
        val optimizedPosts = currentPosts.map { post ->
            if (post.id == postId) {
                val wasFavorited = post.isFavorited
                // Invertimos el estado y actualizamos el contador
                post.copy(
                    isFavorited = !wasFavorited,
                    favoritesCount = if (wasFavorited) post.favoritesCount - 1 else post.favoritesCount + 1
                )
            } else {
                post
            }
        }
        _state.value = _state.value.copy(posts = optimizedPosts)

        // 2. Llamada al Backend
        screenModelScope.launch {
            // Buscamos el post original para saber qué acción tomar (add o remove)
            val originalPost = currentPosts.find { it.id == postId }

            if (originalPost != null) {
                val result = if (originalPost.isFavorited) {
                    favoriteRepository.removeFavorite(postId)
                } else {
                    favoriteRepository.addFavorite(postId)
                }

                // 3. Rollback si falla
                result.onFailure {
                    println("Error favorite: ${it.message}")
                    // Volvemos a la lista original sin cambios
                    _state.value = _state.value.copy(posts = currentPosts)
                }
            }
        }
    }
}