package com.dev.af2.core.network

object TokenManager {
    var token: String? = null

    // Helper para saber si estamos logueados
    fun isLoggedIn(): Boolean = !token.isNullOrBlank()
}