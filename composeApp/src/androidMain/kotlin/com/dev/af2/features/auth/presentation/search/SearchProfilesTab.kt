package com.dev.af2.features.auth.presentation.search

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun SearchProfilesTab(
    profiles: List<SearchProfileResult>,
    onOpenProfile: (SearchProfileResult) -> Unit,
    onToggleFollow: (SearchProfileResult) -> Unit,
    cover: @Composable (profile: SearchProfileResult, modifier: Modifier) -> Unit,
    avatar: @Composable (profile: SearchProfileResult, modifier: Modifier) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(profiles, key = { it.id }) { profile ->
            SearchProfileCard(
                profile = profile,
                onOpenProfile = onOpenProfile,
                onToggleFollow = onToggleFollow,
                cover = { m -> cover(profile, m) },
                avatar = { m -> avatar(profile, m) }
            )
        }
    }
}
