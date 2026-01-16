package com.dev.af2.features.auth.presentation.profile

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import com.dev.af2.features.auth.data.FavoriteRepository
import com.dev.af2.features.auth.data.PostRepository
import com.dev.af2.features.auth.data.remote.User
import com.dev.af2.features.auth.domain.Post
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ProfileUiState(
    val isLoading: Boolean = true,
    val user: User? = null,
    val posts: List<Post> = emptyList(),     // Mis publicaciones
    val savedPosts: List<Post> = emptyList(), // [NUEVO] Favoritos
    val error: String? = null
)

class ProfileScreenModel : ScreenModel {
    private val authRepo = AuthRepository()
    private val postRepo = PostRepository()
    private val favoriteRepo = FavoriteRepository() // [NUEVO]

    private val _state = MutableStateFlow(ProfileUiState())
    val state = _state.asStateFlow()

    init {
        fetchProfile()
    }

    fun fetchProfile() {
        screenModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            // 1. Cargar Usuario
            val userResult = authRepo.getMe()
            val user = userResult.getOrNull()

            if (user != null) {
                // 2. Cargar Mis Posts
                val postsResult = postRepo.getPostsByUser(user.id)
                val posts = postsResult.getOrNull() ?: emptyList()

                // 3. [NUEVO] Cargar Favoritos
                val favsResult = favoriteRepo.getFavorites()
                val favs = favsResult.getOrNull() ?: emptyList()

                _state.value = ProfileUiState(
                    isLoading = false,
                    user = user,
                    posts = posts,
                    savedPosts = favs // Guardamos los favoritos
                )
            } else {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = "No se pudo cargar el perfil"
                )
            }
        }
    }

    // [NUEVO] Actualizar Avatar
    fun updateAvatar(imageBytes: ByteArray) {
        screenModelScope.launch {
            _state.value = _state.value.copy(isLoading = true) // Mostramos carga

            authRepo.updateAvatar(imageBytes)
                .onSuccess { updatedUser ->
                    // Actualizamos solo el usuario, mantenemos los posts
                    _state.value = _state.value.copy(
                        isLoading = false,
                        user = updatedUser // El backend devuelve el usuario con la nueva URL
                    )
                }
                .onFailure {
                    println("Error subiendo avatar: ${it.message}")
                    _state.value = _state.value.copy(isLoading = false)
                    // Aquí podrías manejar un error visual si quieres
                }
        }
    }
}