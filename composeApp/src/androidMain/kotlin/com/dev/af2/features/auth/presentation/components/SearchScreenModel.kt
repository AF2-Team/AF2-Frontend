package com.dev.af2.features.auth.presentation.components

import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import com.dev.af2.features.auth.data.AuthRepository
import com.dev.af2.features.auth.data.SearchRepository
import com.dev.af2.features.auth.data.remote.User
import com.dev.af2.features.auth.domain.Post
import com.dev.af2.features.auth.domain.SearchFilter
import com.dev.af2.features.auth.domain.Tag
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class SearchUiState(
    val query: String = "",
    val activeFilter: SearchFilter = SearchFilter.ALL,
    val isLoading: Boolean = false,
    val users: List<User> = emptyList(),
    val posts: List<Post> = emptyList(),
    val tags: List<Tag> = emptyList(),
    val error: String? = null,
    val currentUserId: String? = null // [NUEVO] Para saber quién soy yo
)

class SearchScreenModel : ScreenModel {
    private val repository = SearchRepository()
    private val authRepository = AuthRepository() // [NUEVO]

    private val _state = MutableStateFlow(SearchUiState())
    val state = _state.asStateFlow()

    private var searchJob: Job? = null

    init {
        // Cargar mi ID al iniciar
        screenModelScope.launch {
            val user = authRepository.getMe().getOrNull()
            if (user != null) {
                _state.value = _state.value.copy(currentUserId = user.id)
            }
        }
    }

    fun onQueryChange(newQuery: String) {
        _state.value = _state.value.copy(query = newQuery)
        searchJob?.cancel()

        if (newQuery.isBlank()) {
            _state.value = _state.value.copy(users = emptyList(), posts = emptyList(), tags = emptyList())
            return
        }

        searchJob = screenModelScope.launch {
            delay(500)
            performSearch()
        }
    }

    fun onFilterChange(filter: SearchFilter) {
        _state.value = _state.value.copy(activeFilter = filter)
        if (_state.value.query.isNotBlank()) {
            searchJob?.cancel()
            searchJob = screenModelScope.launch { performSearch() }
        }
    }

    private suspend fun performSearch() {
        val query = _state.value.query
        val filter = _state.value.activeFilter

        _state.value = _state.value.copy(isLoading = true, error = null)

        // Tu lógica de búsqueda existente...
        when (filter) {
            SearchFilter.ALL -> {
                repository.searchAll(query).onSuccess { res ->
                    _state.value = _state.value.copy(isLoading = false, users = res.users, posts = res.posts, tags = res.tags)
                }.onFailure { _state.value = _state.value.copy(isLoading = false, error = it.message) }
            }
            SearchFilter.USERS -> {
                repository.searchUsers(query).onSuccess {
                    _state.value = _state.value.copy(isLoading = false, users = it, posts = emptyList(), tags = emptyList())
                }.onFailure { _state.value = _state.value.copy(isLoading = false, error = it.message) }
            }
            SearchFilter.POSTS -> {
                repository.searchPosts(query).onSuccess {
                    _state.value = _state.value.copy(isLoading = false, posts = it, users = emptyList(), tags = emptyList())
                }.onFailure { _state.value = _state.value.copy(isLoading = false, error = it.message) }
            }
            SearchFilter.TAGS -> {
                repository.searchTags(query).onSuccess {
                    _state.value = _state.value.copy(isLoading = false, tags = it, users = emptyList(), posts = emptyList())
                }.onFailure { _state.value = _state.value.copy(isLoading = false, error = it.message) }
            }
        }
    }
}