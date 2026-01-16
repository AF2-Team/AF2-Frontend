package com.dev.af2.features.auth.domain

import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName
import com.dev.af2.features.auth.data.remote.User
@Serializable
data class UserProfileResponse(
    val success: Boolean,
    val message: String,
    val data: UserProfileData // Esto envuelve los 3 objetos
)

@Serializable
data class UserProfileData(
    val user: User, // Tu clase User actual
    val stats: UserStats,
    val viewer: ViewerInfo
)

@Serializable
data class UserStats(
    val posts: Int,
    val followers: Int,
    val following: Int
)

@Serializable
data class ViewerInfo(
    val isFollowing: Boolean
)