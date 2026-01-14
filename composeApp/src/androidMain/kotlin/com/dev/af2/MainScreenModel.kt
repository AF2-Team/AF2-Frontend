package com.dev.af2

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import com.dev.af2.features.auth.data.remote.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MainScreenModel : ScreenModel {
    private val repository = AuthRepository()

    // Guardamos el usuario actual aquí. Al inicio es null.
    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser = _currentUser.asStateFlow()

    init {
        fetchCurrentUser()
    }

    fun fetchCurrentUser() {
        screenModelScope.launch {
            // Llamamos al endpoint 'user/me' que ya arreglamos
            repository.getMe().onSuccess { user ->
                _currentUser.value = user
            }.onFailure {
                println("Error cargando usuario en Main: ${it.message}")
            }
        }
    }
}