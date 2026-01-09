package com.dev.af2.features.auth.presentation.register

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import com.dev.af2.features.auth.data.remote.RegisterRequest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class RegisterUiState(
    val isLoading: Boolean = false,
    val isSuccess: Boolean = false,
    val usernameError: String? = null, // Error específico para el usuario
    val emailError: String? = null,    // Error específico para el email
    val generalError: String? = null   // Error genérico (ej: sin internet)
)

class RegisterScreenModel : ScreenModel {
    private val repository = AuthRepository()

    private val _state = MutableStateFlow(RegisterUiState())
    val state: StateFlow<RegisterUiState> = _state.asStateFlow()

    fun register(name: String, email: String, username: String, password: String) {
        screenModelScope.launch {
            // Reiniciamos errores y ponemos loading
            _state.value = RegisterUiState(isLoading = true)

            val request = RegisterRequest(name, email, password, username)
            val result = repository.register(request)

            result.onSuccess {
                _state.value = RegisterUiState(isSuccess = true)
            }.onFailure { error ->
                val msg = error.message ?: "Error desconocido"
                println("DEBUG_MODEL: Error recibido -> $msg")

                val newState = when {
                    // El backend envía "Username already taken", así que buscamos "Username"
                    msg.contains("Username", ignoreCase = true) -> RegisterUiState(
                        usernameError = "Este usuario ya existe, intenta con otro."
                    )
                    // Probablemente envíe "Email already taken" o similar
                    msg.contains("Email", ignoreCase = true) -> RegisterUiState(
                        emailError = "Este correo ya está registrado."
                    )
                    else -> RegisterUiState(generalError = msg)
                }
                _state.value = newState
            }
        }
    }

    // Función para limpiar errores cuando el usuario empieza a escribir de nuevo
    fun clearErrors() {
        // Mantenemos el estado actual pero quitamos los errores
        _state.value = _state.value.copy(
            usernameError = null,
            emailError = null,
            generalError = null
        )
    }
}