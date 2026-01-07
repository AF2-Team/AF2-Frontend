package com.dev.af2.features.auth.presentation.register

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import com.dev.af2.features.auth.data.remote.RegisterRequest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

// Estados posibles de la UI
sealed class RegisterState {
    data object Idle : RegisterState()
    data object Loading : RegisterState()
    data object Success : RegisterState()
    data class Error(val message: String) : RegisterState()
}

class RegisterScreenModel : ScreenModel {
    private val repository = AuthRepository()

    private val _state = MutableStateFlow<RegisterState>(RegisterState.Idle)
    val state: StateFlow<RegisterState> = _state.asStateFlow()


    fun register(name: String, email: String, username: String, password: String) {
        screenModelScope.launch {
            println("DEBUG_MODEL: A. Función register llamada")
            _state.value = RegisterState.Loading

            val request = RegisterRequest(
                name = name,
                email = email,
                username = username,
                password = password
            )

            val result = repository.register(request)

            result.onSuccess {
                _state.value = RegisterState.Success
            }.onFailure { error ->
                _state.value = RegisterState.Error(error.message ?: "Error desconocido")
            }
        }
    }

    fun resetState() {
        _state.value = RegisterState.Idle
    }
}