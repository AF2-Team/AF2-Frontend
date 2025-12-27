package com.dev.af2.features.auth.presentation.search

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.dev.af2.features.auth.presentation.components.PostItem
import com.dev.af2.features.auth.domain.Post

@Composable
fun SearchPostsTab(
    posts: List<Post>,
    order: PostOrder,
    onOrderClick: () -> Unit
) {
    Column {
        TextButton(
            onClick = onOrderClick,
            modifier = Modifier.padding(horizontal = 16.dp)
        ) {
            Text(
                text = if (order == PostOrder.POPULAR)
                    "Populares ▼"
                else
                    "Recientes ▼"
            )
        }

        LazyColumn(
            contentPadding = PaddingValues(bottom = 16.dp)
        ) {
            items(posts) { post ->
                PostItem(post = post)
            }
        }
    }
}
