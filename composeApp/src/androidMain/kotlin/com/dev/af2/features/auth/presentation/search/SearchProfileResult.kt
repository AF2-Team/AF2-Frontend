package com.dev.af2.features.auth.presentation.search

data class SearchProfileResult(
    val id: String,
    val username: String,
    val bio: String,
    val isFollowing: Boolean,
    // Para las iamgenes “keys” o urls por ahora
    val coverUrl: String? = null,
    val avatarUrl: String? = null
)
