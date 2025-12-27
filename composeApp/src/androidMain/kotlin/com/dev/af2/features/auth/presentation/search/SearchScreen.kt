package com.dev.af2.features.auth.presentation.search

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import com.dev.af2.features.auth.domain.Post
import com.dev.af2.features.auth.presentation.components.*

@Composable
fun SearchScreen(
    query: String,
    posts: List<Post>,
    relatedTags: List<String>,
    profiles: List<SearchProfileResult>,
    followedTags: SnapshotStateList<String>,
    onBackToHome: () -> Unit,
    onManageTags: () -> Unit,
    onOpenTag: (String) -> Unit,
    onOpenUserProfile: (String) -> Unit,
    onToggleFollowUser: (String) -> Unit
) {

    val pagerState = rememberPagerState(pageCount = { 3 })
    val scope = rememberCoroutineScope()

    var selectedOrder by remember { mutableStateOf(PostOrder.POPULAR) }
    var showOrderSheet by remember { mutableStateOf(false) }

    val isTagSearch = query.startsWith("#")
    var isFollowingTag by remember {
        mutableStateOf(followedTags.contains(query))
    }


    Column(modifier = Modifier.fillMaxSize()) {

        CustomTopBar(
            title = query,
            onBackClick = onBackToHome,
            actions = {
                if (isTagSearch) {
                    FollowTagButton(
                        isFollowing = isFollowingTag,
                        onClick = {
                            isFollowingTag = !isFollowingTag
                            if (isFollowingTag) {
                                if (!followedTags.contains(query)) {
                                    followedTags.add(query)
                                }
                            } else {
                                followedTags.remove(query)
                            }
                        }
                    )
                }
            }
        )

        SearchBar(
            query = query,
            onQueryChange = {}
        )

        TabRow(selectedTabIndex = pagerState.currentPage) {

            listOf("Publicaciones", "Etiquetas", "Perfiles")
                .forEachIndexed { index, title ->

                    Tab(
                        selected = pagerState.currentPage == index,
                        onClick = {
                            scope.launch {
                                pagerState.animateScrollToPage(index)
                            }
                        },
                        text = { Text(title) }
                    )
                }
        }

        HorizontalPager(
            state = pagerState,
            modifier = Modifier.fillMaxSize()
        ) { page ->

            when (page) {

                0 -> {
                    SearchPostsTab(
                        posts = postsSortedByOrder(posts, selectedOrder),
                        order = selectedOrder,
                        onOrderClick = { showOrderSheet = true }
                    )
                }

                1 -> {
                    SearchTagsTab(
                        mainTag = query.removePrefix("#"),
                        relatedTags = relatedTags,
                        onTagClick = onOpenTag
                    )
                }

                2 -> {
                    SearchProfilesTab(
                        profiles = profiles,
                        onOpenProfile = { profile ->
                            onOpenUserProfile(profile.id)
                        },
                        onToggleFollow = { profile ->
                            onToggleFollowUser(profile.id)
                        },
                        cover = { _, modifier ->
                            PlaceholderCover(modifier)
                        },
                        avatar = { _, modifier ->
                            PlaceholderAvatar(modifier)
                        }
                    )

                    CreatePostFab()
                }
            }
        }
    }

    if (showOrderSheet && pagerState.currentPage == 0) {
        PostOrderBottomSheet(
            selectedOrder = selectedOrder,
            onSelect = { selectedOrder = it },
            onDismiss = { showOrderSheet = false }
        )
    }
}

private fun postsSortedByOrder(
    posts: List<Post>,
    order: PostOrder
): List<Post> {
    return when (order) {
        PostOrder.POPULAR -> posts.sortedByDescending { it.likes }
        PostOrder.RECENT -> posts.sortedByDescending { it.date }
    }
}
}
