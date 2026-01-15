package com.dev.af2.features.auth.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Tag
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.model.rememberScreenModel
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow

// Imports de tu proyecto
import com.dev.af2.core.designsystem.getAlegreyaFontFamily
import com.dev.af2.features.auth.data.remote.User
import com.dev.af2.features.auth.domain.SearchFilter
import com.dev.af2.features.auth.domain.Tag
import com.dev.af2.features.auth.presentation.comments.CommentsPage
import com.dev.af2.features.auth.presentation.profile.ProfilePage // Asumiendo que existe

// --- COLORES ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorInputBg = Color(0xFFFAF7F7)
private val ColorAccent = Color(0xFFBCA1BD)

class SearchPage : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        val screenModel = rememberScreenModel { SearchScreenModel() }

        SearchScreen(
            screenModel = screenModel,
            onTagClick = { tag -> navigator.push(TagDetailPage(tag.name)) }, // Ajusta según tu TagDetailPage
            onUserClick = { user -> navigator.push(ProfilePage(user.id)) }, // Ajusta según tu ProfilePage
            onPostClick = { post -> navigator.push(CommentsPage(post.id)) }
        )
    }
}

@Composable
fun SearchScreen(
    screenModel: SearchScreenModel,
    onTagClick: (Tag) -> Unit,
    onUserClick: (User) -> Unit,
    onPostClick: (com.dev.af2.features.auth.domain.Post) -> Unit
) {
    val state by screenModel.state.collectAsState()

    // Mocks para cuando no hay búsqueda (Historial visual)
    val recentSearches = listOf("#arte", "diseño ui", "#kotlin", "viajes")

    Scaffold(
        topBar = {
            Surface(
                color = ColorBgWhite,
                shadowElevation = 0.dp // Quitamos elevación para un look más limpio con los chips
            ) {
                Column {
                    // 1. INPUT BÚSQUEDA
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        SearchInput(
                            value = state.query,
                            onValueChange = { screenModel.onQueryChange(it) },
                            onClearClick = { screenModel.onQueryChange("") }
                        )
                    }

                    // 2. FILTROS (CHIPS) - Solo visibles si hay texto o intención de búsqueda
                    if (state.query.isNotEmpty()) {
                        SearchFilterChips(
                            activeFilter = state.activeFilter,
                            onFilterSelect = { screenModel.onFilterChange(it) }
                        )
                        HorizontalDivider(color = ColorInputBg, thickness = 1.dp)
                    }
                }
            }
        },
        containerColor = ColorBgWhite
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 16.dp)
            ) {
                // CASO A: MOSTRAR RESULTADOS REALES
                if (state.query.isNotEmpty()) {
                    if (state.users.isEmpty() && state.posts.isEmpty() && state.tags.isEmpty() && !state.isLoading) {
                        item {
                            Box(Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
                                Text("No se encontraron resultados", color = Color.Gray)
                            }
                        }
                    }

                    // 1. USUARIOS
                    if (state.users.isNotEmpty()) {
                        item { SectionTitle("Personas", Modifier.padding(start = 16.dp, top = 16.dp)) }
                        items(state.users) { user ->
                            UserResultItem(user = user, onClick = { onUserClick(user) })
                        }
                    }

                    // 2. TAGS
                    if (state.tags.isNotEmpty()) {
                        item { SectionTitle("Etiquetas", Modifier.padding(start = 16.dp, top = 16.dp)) }
                        items(state.tags) { tag ->
                            TagResultItem(tag = tag, onClick = { onTagClick(tag) })
                        }
                    }

                    // 3. POSTS
                    if (state.posts.isNotEmpty()) {
                        item { SectionTitle("Publicaciones", Modifier.padding(start = 16.dp, top = 16.dp)) }
                        items(state.posts) { post ->
                            PostItem(
                                post = post,
                                onLikeClick = {},
                                onCommentClick = { onPostClick(post) },
                                onShareClick = {},
                                onProfileClick = {},
                                onFollowClick = {}
                            )
                            HorizontalDivider(thickness = 4.dp, color = ColorInputBg)
                        }
                    }
                }
                // CASO B: MOSTRAR HISTORIAL (MOCK)
                else {
                    item { Spacer(modifier = Modifier.height(16.dp)) }
                    item { SectionTitle("Recientes", Modifier.padding(horizontal = 16.dp)) }
                    items(recentSearches) { search ->
                        RecentSearchItem(
                            text = search,
                            onClick = { screenModel.onQueryChange(search) }
                        )
                    }
                }
            }

            // LOADER SUPERPUESTO
            if (state.isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center),
                    color = ColorAccent
                )
            }
        }
    }
}

// --- COMPONENTES AUXILIARES ---

@Composable
private fun SearchFilterChips(
    activeFilter: SearchFilter,
    onFilterSelect: (SearchFilter) -> Unit
) {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.padding(bottom = 12.dp)
    ) {
        items(SearchFilter.values()) { filter ->
            val isSelected = activeFilter == filter
            val bgColor = if (isSelected) ColorAccent else ColorInputBg
            val textColor = if (isSelected) Color.White else ColorDarkText

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(50))
                    .background(bgColor)
                    .clickable { onFilterSelect(filter) }
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Text(
                    text = filter.label,
                    color = textColor,
                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                    fontSize = 14.sp
                )
            }
        }
    }
}

@Composable
private fun SearchInput(
    value: String,
    onValueChange: (String) -> Unit,
    onClearClick: () -> Unit
) {
    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier
            .fillMaxWidth()
            .height(44.dp)
            .background(ColorInputBg, RoundedCornerShape(22.dp)),
        textStyle = TextStyle(color = ColorDarkText, fontSize = 16.sp),
        singleLine = true,
        cursorBrush = SolidColor(ColorAccent),
        decorationBox = { innerTextField ->
            Row(
                modifier = Modifier.padding(horizontal = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = null,
                    tint = Color.Gray
                )
                Spacer(modifier = Modifier.width(8.dp))
                Box(modifier = Modifier.weight(1f)) {
                    if (value.isEmpty()) {
                        Text("Buscar...", color = Color.Gray)
                    }
                    innerTextField()
                }
                if (value.isNotEmpty()) {
                    IconButton(onClick = onClearClick, modifier = Modifier.size(20.dp)) {
                        Icon(Icons.Default.Close, null, tint = Color.Gray)
                    }
                }
            }
        }
    )
}

@Composable
private fun SectionTitle(text: String, modifier: Modifier = Modifier) {
    Text(
        text = text,
        style = MaterialTheme.typography.titleMedium.copy(
            fontWeight = FontWeight.Bold,
            color = ColorDarkText
        ),
        modifier = modifier.padding(bottom = 8.dp)
    )
}

@Composable
private fun RecentSearchItem(text: String, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(Icons.Default.History, null, tint = Color.Gray, modifier = Modifier.size(20.dp))
        Spacer(modifier = Modifier.width(12.dp))
        Text(text, color = ColorDarkText, fontSize = 16.sp)
        Spacer(modifier = Modifier.weight(1f))
        Icon(Icons.Default.Close, null, tint = Color.LightGray, modifier = Modifier.size(16.dp))
    }
}

// Adaptado para usar el objeto Tag real
@Composable
private fun TagResultItem(tag: Tag, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(ColorInputBg, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.Tag, null, tint = ColorDarkText)
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(
                text = "#${tag.name}",
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontWeight = FontWeight.Bold,
                    color = ColorDarkText
                )
            )
            Text(
                text = "${tag.postsCount} posts",
                style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray)
            )
        }
    }
}

// Nuevo componente para mostrar usuarios
@Composable
private fun UserResultItem(user: User, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Avatar Placeholder (usar AsyncImage después)
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)
                .background(Color.LightGray),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.Person, null, tint = Color.White)
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(
                text = user.name,
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontWeight = FontWeight.Bold,
                    color = ColorDarkText
                )
            )
            Text(
                text = "@${user.username}",
                style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray)
            )
        }
    }
}