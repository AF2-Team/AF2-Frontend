package com.dev.af2.features.auth.presentation.profile

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import com.dev.af2.features.auth.data.PostRepository
import com.dev.af2.features.auth.data.remote.User
import com.dev.af2.features.auth.domain.Post
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ProfileUiState(
    val isLoading: Boolean = true,
    val user: User? = null,
    val posts: List<Post> = emptyList(),
    val error: String? = null
)

class ProfileScreenModel : ScreenModel {
    private val authRepository = AuthRepository()
    private val postRepository = PostRepository()

    private val _state = MutableStateFlow(ProfileUiState())
    val state = _state.asStateFlow()

    init {
        // Cargamos el perfil automáticamente al iniciar
        fetchProfile()
    }

    // [CORRECCIÓN] Cambiamos el nombre a 'fetchProfile' y la hacemos pública (sin 'private')
    fun fetchProfile() {
        screenModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            // 1. Cargar Mis Datos (usuario logueado)
            val userResult = authRepository.getMe()
            val user = userResult.getOrNull()

            if (user != null) {
                // 2. Si tengo usuario, Cargar Mis Posts
                val postsResult = postRepository.getPostsByUser(user.id)
                val posts = postsResult.getOrNull() ?: emptyList()

                _state.value = ProfileUiState(
                    isLoading = false,
                    user = user,
                    posts = posts
                )
            } else {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = userResult.exceptionOrNull()?.message ?: "No se pudo cargar el perfil"
                )
            }
        }
    }
}