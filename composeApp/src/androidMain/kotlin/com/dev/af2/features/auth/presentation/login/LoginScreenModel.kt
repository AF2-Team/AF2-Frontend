package com.dev.af2.features.auth.presentation.login

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import com.dev.af2.features.auth.data.remote.LoginRequest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch


data class LoginUiState(
    val isLoading: Boolean = false,
    val isSuccess: Boolean = false,
    val emailError: String? = null,
    val passwordError: String? = null,
    val generalError: String? = null
)

class LoginScreenModel : ScreenModel {
    private val repository = AuthRepository()

    private val _state = MutableStateFlow(LoginUiState())
    val state: StateFlow<LoginUiState> = _state.asStateFlow()

    fun login(email: String, pass: String) {
        screenModelScope.launch {
            _state.value = LoginUiState(isLoading = true)

            val request = LoginRequest(email = email, password = pass)
            val result = repository.login(request)

            result.onSuccess {
                _state.value = LoginUiState(isSuccess = true)
            }.onFailure { error ->
                val msg = error.message ?: "Error desconocido"
                println("DEBUG_LOGIN: $msg")

                // Lógica simple para asignar el error al campo correcto
                val newState = when {
                    msg.contains("User not found", ignoreCase = true) -> LoginUiState(emailError = "Usuario no encontrado")
                    msg.contains("password", ignoreCase = true) -> LoginUiState(passwordError = "Contraseña incorrecta")
                    msg.contains("Invalid credentials", ignoreCase = true) -> LoginUiState(passwordError = "Correo y/o contraseña incorrecta")
                    else -> LoginUiState(generalError = msg)
                }
                _state.value = newState
            }
        }
    }

    fun clearErrors() {
        _state.value = _state.value.copy(
            emailError = null,
            passwordError = null,
            generalError = null
        )
    }
}