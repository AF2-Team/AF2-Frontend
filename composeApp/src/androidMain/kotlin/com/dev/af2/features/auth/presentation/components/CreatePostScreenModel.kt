package com.dev.af2.features.auth.presentation.components

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.PostRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class CreatePostUiState(
    val isLoading: Boolean = false,
    val isSuccess: Boolean = false,
    val error: String? = null
)

class CreatePostScreenModel : ScreenModel {
    private val repository = PostRepository()

    private val _state = MutableStateFlow(CreatePostUiState())
    val state = _state.asStateFlow()

    fun createPost(content: String, images: List<ByteArray>) {
        if (content.isBlank() && images.isEmpty()) {
            _state.value = CreatePostUiState(error = "El post no puede estar vacío")
            return
        }

        screenModelScope.launch {
            _state.value = CreatePostUiState(isLoading = true)

            val result = repository.createPost(content, images)

            result.onSuccess {
                println("DEBUG_POST: Post creado con éxito!")
                _state.value = CreatePostUiState(isSuccess = true)
            }.onFailure { e ->
                println("DEBUG_POST: Fallo: ${e.message}")
                _state.value = CreatePostUiState(error = e.message ?: "Error desconocido")
            }
        }
    }

    fun resetState() {
        _state.value = CreatePostUiState()
    }
}