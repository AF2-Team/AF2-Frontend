package com.dev.af2.features.auth.presentation.search

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.dev.af2.features.auth.presentation.components.SectionTitle
import com.dev.af2.features.auth.presentation.components.TagCard
import com.dev.af2.features.auth.presentation.components.TagHeroCard

@Composable
fun SearchTagsTab(
    mainTag: String,
    relatedTags: List<String>,
    onTagClick: (String) -> Unit
) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(2),
        contentPadding = PaddingValues(16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {

        // Etiqueta popular
        item(span = { GridItemSpan(2) }) {
            SectionTitle(title = "Etiqueta popular")
            Spacer(modifier = Modifier.height(8.dp))
            TagHeroCard(
                tag = mainTag,
                onClick = { onTagClick(mainTag) }
            )
        }

        // Etiquetas relacionadas
        item(span = { GridItemSpan(2) }) {
            SectionTitle(title = "Etiquetas relacionadas")
        }

        items(relatedTags) { tag ->
            TagCard(
                tag = tag,
                onClick = { onTagClick(tag) }
            )
        }
    }
}
