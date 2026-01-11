package com.dev.af2.features.auth.presentation

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
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
}