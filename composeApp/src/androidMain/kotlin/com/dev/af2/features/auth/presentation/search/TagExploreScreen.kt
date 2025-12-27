package com.dev.af2.features.auth.presentation.search

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.dev.af2.features.auth.domain.Post
import com.dev.af2.features.auth.presentation.components.CustomTopBar
import com.dev.af2.features.auth.presentation.components.PostItem
import com.dev.af2.features.auth.presentation.components.FollowTagButton

@Composable
fun TagExploreScreen(
    tag: String,
    posts: List<Post>,
    isFollowing: Boolean,
    onFollowToggle: () -> Unit,
    onBack: () -> Unit
) {
    val pagerState = rememberPagerState(pageCount = { 2 })

    Column(modifier = Modifier.fillMaxSize()) {

        CustomTopBar(
            title = "#$tag",
            onBackClick = onBack,
            actions = {
                FollowTagButton(
                    isFollowing = isFollowing,
                    onClick = onFollowToggle
                )
            }
        )

        TabRow(selectedTabIndex = pagerState.currentPage) {
            Tab(
                selected = pagerState.currentPage == 0,
                onClick = { LaunchedEffect(Unit) { pagerState.animateScrollToPage(0) } },
                text = { Text("Populares") }
            )
            Tab(
                selected = pagerState.currentPage == 1,
                onClick = { LaunchedEffect(Unit) { pagerState.animateScrollToPage(1) } },
                text = { Text("Recientes") }
            )
        }

        HorizontalPager(state = pagerState) { page ->
            val order = if (page == 0) PostOrder.POPULAR else PostOrder.RECENT
            val sortedPosts = postsSortedByOrder(posts, order)

            LazyColumn {
                items(sortedPosts) { post ->
                    PostItem(post = post)
                }
            }
        }
    }

    CreatePostFab()
}
