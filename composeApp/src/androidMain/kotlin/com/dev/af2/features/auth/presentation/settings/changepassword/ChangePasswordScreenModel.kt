package com.dev.af2.features.auth.presentation.settings.changepassword

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ChangePasswordUiState(
    val isLoading: Boolean = false,
    val isSuccess: Boolean = false,
    val error: String? = null
)

class ChangePasswordScreenModel : ScreenModel {
    private val repository = AuthRepository()

    private val _state = MutableStateFlow(ChangePasswordUiState())
    val state = _state.asStateFlow()

    fun changePassword(current: String, new: String, confirm: String) {
        // 1. Validaciones locales antes de llamar a la red
        if (current.isBlank() || new.isBlank() || confirm.isBlank()) {
            _state.value = ChangePasswordUiState(error = "Todos los campos son obligatorios")
            return
        }

        if (new != confirm) {
            _state.value = ChangePasswordUiState(error = "Las nuevas contraseñas no coinciden")
            return
        }

        if (new.length < 6) {
            _state.value = ChangePasswordUiState(error = "La contraseña debe tener al menos 6 caracteres")
            return
        }

        // 2. Llamada a la red (sin cerrar pantalla)
        screenModelScope.launch {
            _state.value = ChangePasswordUiState(isLoading = true)

            val result = repository.changePassword(current, new)

            result.onSuccess {
                println("✅ Password cambiado exitosamente")
                // Solo actualizamos el estado. La UI reaccionará a esto.
                _state.value = ChangePasswordUiState(isSuccess = true)
            }.onFailure { e ->
                println("❌ Error cambiando password: ${e.message}")
                _state.value = ChangePasswordUiState(error = e.message ?: "Error desconocido")
            }
        }
    }

    fun clearError() {
        _state.value = _state.value.copy(error = null)
    }
}