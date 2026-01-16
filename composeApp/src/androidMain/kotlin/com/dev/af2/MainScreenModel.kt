package com.dev.af2

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import com.dev.af2.features.auth.data.remote.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

// Estado para guardar al usuario globalmente en la pantalla principal
data class MainUiState(
    val currentUser: User? = null,
    val isLoading: Boolean = false
)

class MainScreenModel : ScreenModel {
    private val authRepository = AuthRepository()

    private val _state = MutableStateFlow(MainUiState())
    val state = _state.asStateFlow()

    init {
        getCurrentUser()
    }

    // Esta función carga al usuario al iniciar la app
    fun getCurrentUser() {
        screenModelScope.launch {
            _state.value = _state.value.copy(isLoading = true)
            authRepository.getMe()
                .onSuccess { user ->
                    _state.value = _state.value.copy(isLoading = false, currentUser = user)
                }
                .onFailure {
                    _state.value = _state.value.copy(isLoading = false)
                    println("Error cargando usuario principal: ${it.message}")
                }
        }
    }
}