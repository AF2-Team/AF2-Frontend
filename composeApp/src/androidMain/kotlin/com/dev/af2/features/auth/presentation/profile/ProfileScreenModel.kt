package com.dev.af2.features.auth.presentation.profile

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import com.dev.af2.features.auth.data.remote.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ProfileUiState(
    val isLoading: Boolean = true, // Carga inicial
    val user: User? = null,
    val error: String? = null
)

class ProfileScreenModel : ScreenModel {
    private val repository = AuthRepository()

    private val _state = MutableStateFlow(ProfileUiState())
    val state = _state.asStateFlow()

    init {
        fetchProfile()
    }

    fun fetchProfile() {
        screenModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            repository.getMe().fold(
                onSuccess = { user ->
                    _state.value = ProfileUiState(isLoading = false, user = user)
                },
                onFailure = { e ->
                    _state.value = ProfileUiState(isLoading = false, error = e.message)
                }
            )
        }
    }
}