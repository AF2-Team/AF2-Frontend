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

data class UserProfileUiState(
    val isLoading: Boolean = true,
    val user: User? = null,
    val posts: List<Post> = emptyList(),
    val error: String? = null,

    // Estados específicos para la lógica de Follow
    val isFollowing: Boolean = false,
    val followersCount: Int = 0,
    val followingCount: Int = 0
)

class UserProfileScreenModel(private val userId: String) : ScreenModel {
    private val authRepo = AuthRepository()
    private val postRepo = PostRepository()
    private val followRepo = FollowRepository()

    private val _state = MutableStateFlow(UserProfileUiState())
    val state = _state.asStateFlow()

    init {
        loadProfile()
    }

    fun loadProfile() {
        screenModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            val profileResult = authRepo.getUserProfile(userId)
            val profileData = profileResult.getOrNull()?.data

            if (profileData != null) {
                // 2. Cargar Posts del usuario
                val postsResult = postRepo.getPostsByUser(userId)
                val posts = postsResult.getOrNull() ?: emptyList()

                // 3. Actualizar estado con TODOS los datos desagregados
                _state.value = UserProfileUiState(
                    isLoading = false,
                    user = profileData.user,
                    posts = posts,
                    // Mapeo crítico para que funcione el botón y contadores
                    isFollowing = profileData.viewer.isFollowing,
                    followersCount = profileData.stats.followers,
                    followingCount = profileData.stats.following
                )
            } else {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = profileResult.exceptionOrNull()?.message ?: "Error al cargar perfil"
                )
            }
        }
    }

    fun toggleFollow() {
        screenModelScope.launch {
            val currentState = _state.value
            val wasFollowing = currentState.isFollowing

            // --- 1. Actualización Optimista (UI responde YA) ---
            _state.value = currentState.copy(
                isFollowing = !wasFollowing,
                followersCount = if (wasFollowing) {
                    currentState.followersCount - 1 // Si seguía, restamos
                } else {
                    currentState.followersCount + 1 // Si no seguía, sumamos
                }
            )

            // --- 2. Llamada al Backend ---
            val result = if (wasFollowing) {
                followRepo.unfollowUser(userId)
            } else {
                followRepo.followUser(userId)
            }

            // --- 3. Reversión si falla (Rollback) ---
            if (result.isFailure) {
                // Si falla la API, volvemos al estado anterior silenciosamente
                _state.value = currentState
                // Opcional: Mostrar error en un Snackbar
                println("Error toggle follow: ${result.exceptionOrNull()?.message}")
            }
        }
    }
}