package com.dev.af2.features.auth.presentation.search

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun PostOrderBottomSheet(
    selectedOrder: PostOrder,
    onSelect: (PostOrder) -> Unit,
    onDismiss: () -> Unit
) {
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(modifier = Modifier.padding(16.dp)) {

            Text(
                text = "Orden",
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            OrderOption(
                text = "Populares",
                selected = selectedOrder == PostOrder.POPULAR
            ) {
                onSelect(PostOrder.POPULAR)
                onDismiss()
            }

            OrderOption(
                text = "Recientes",
                selected = selectedOrder == PostOrder.RECENT
            ) {
                onSelect(PostOrder.RECENT)
                onDismiss()
            }
        }
    }
}

@Composable
private fun OrderOption(
    text: String,
    selected: Boolean,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text, style = MaterialTheme.typography.bodyMedium)
        if (selected) {
            Icon(Icons.Default.Check, contentDescription = null)
        }
    }
}
