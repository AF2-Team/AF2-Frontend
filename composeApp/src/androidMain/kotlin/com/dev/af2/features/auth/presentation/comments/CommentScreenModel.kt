package com.dev.af2.features.auth.presentation.comments

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.PostRepository
import com.dev.af2.features.auth.domain.Comment
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class CommentsUiState(
    val isLoading: Boolean = true,
    val comments: List<Comment> = emptyList(),
    val error: String? = null,
    val isSending: Boolean = false
)

class CommentsScreenModel(private val postId: String) : ScreenModel {
    private val repository = PostRepository()
    private val _state = MutableStateFlow(CommentsUiState())
    val state = _state.asStateFlow()

    init {
        loadComments()
    }

    fun loadComments() {
        screenModelScope.launch {
            _state.value = _state.value.copy(isLoading = true)
            repository.getComments(postId).onSuccess {
                _state.value = CommentsUiState(isLoading = false, comments = it)
            }.onFailure {
                _state.value = CommentsUiState(isLoading = false, error = it.message)
            }
        }
    }

    fun sendComment(text: String) {
        screenModelScope.launch {
            repository.createComment(postId, text).onSuccess { newComment ->
                // Actualización instantánea: Agregamos el nuevo comentario arriba
                val newList = listOf(newComment) + _state.value.comments
                _state.value = _state.value.copy(comments = newList)
            }
        }
    }
}