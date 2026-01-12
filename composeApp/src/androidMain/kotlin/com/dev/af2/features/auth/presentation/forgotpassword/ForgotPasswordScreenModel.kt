package com.dev.af2.features.auth.presentation.forgotpassword

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ForgotPasswordUiState(
    val isLoading: Boolean = false,
    val isSuccess: Boolean = false,
    val error: String? = null
)

class ForgotPasswordScreenModel : ScreenModel {
    private val repository = AuthRepository()

    private val _state = MutableStateFlow(ForgotPasswordUiState())
    val state = _state.asStateFlow()

    fun sendResetLink(email: String) {
        if (email.isBlank() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            _state.value = ForgotPasswordUiState(error = "Ingresa un correo válido")
            return
        }

        screenModelScope.launch {
            _state.value = ForgotPasswordUiState(isLoading = true)

            val result = repository.forgotPassword(email)

            result.onSuccess {
                println("✅ Link de recuperación enviado (simulado)")
                _state.value = ForgotPasswordUiState(isSuccess = true)
            }.onFailure { e ->
                println("❌ Error forgot password: ${e.message}")
                _state.value = ForgotPasswordUiState(error = e.message ?: "Error desconocido")
            }
        }
    }

    fun clearError() {
        _state.value = _state.value.copy(error = null)
    }
}