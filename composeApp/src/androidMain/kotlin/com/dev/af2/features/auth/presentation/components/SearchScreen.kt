package com.dev.af2.features.auth.presentation.components


import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Tag
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow

// Imports de tu proyecto
import com.dev.af2.core.designsystem.getAlegreyaFontFamily

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
        SearchScreen(
            onTagClick = { tag ->
                // Navegar al detalle de la etiqueta
                navigator.push(TagDetailPage(tag))
            }
        )
    }
}

@Composable
fun SearchScreen(
    onTagClick: (String) -> Unit
) {
    val alegreyaFamily = getAlegreyaFontFamily()
    var searchText by remember { mutableStateOf("") }
    var isSearchActive by remember { mutableStateOf(false) }

    // Mocks
    val recentSearches = listOf("#arte", "diseño ui", "#kotlin", "viajes")
    val followedTags = listOf("fantasia", "accion", "romance", "sci-fi")

    Scaffold(
        topBar = {
            // Barra de Búsqueda Personalizada
            Surface(
                color = ColorBgWhite,
                shadowElevation = 4.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    SearchInput(
                        value = searchText,
                        onValueChange = { searchText = it },
                        onFocusChange = { isSearchActive = it },
                        onClearClick = { searchText = "" }
                    )
                }
            }
        },
        containerColor = ColorBgWhite
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp)
        ) {
            // 1. RESULTADOS DE BÚSQUEDA (Si está escribiendo)
            if (searchText.isNotEmpty()) {
                item {
                    Text(
                        "Resultados para \"$searchText\"",
                        style = MaterialTheme.typography.titleMedium.copy(color = Color.Gray),
                        modifier = Modifier.padding(vertical = 16.dp)
                    )
                }
                // Aquí irían los resultados reales filtrados
            } else {
                // 2. BÚSQUEDAS RECIENTES
                if (recentSearches.isNotEmpty()) {
                    item {
                        SectionTitle("Recientes")
                    }
                    items(recentSearches) { search ->
                        RecentSearchItem(text = search, onClick = { searchText = search })
                    }
                }

                item { Spacer(modifier = Modifier.height(24.dp)) }

                // 3. ETIQUETAS QUE SIGUES
                item {
                    SectionTitle("Etiquetas que sigues")
                }
                // Grid simple o FlowRow para etiquetas
                item {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        followedTags.forEach { tag ->
                            TagItem(tag = tag, onClick = { onTagClick(tag) })
                        }
                    }
                }
            }
        }
    }
}

// --- COMPONENTES ---

@Composable
private fun SearchInput(
    value: String,
    onValueChange: (String) -> Unit,
    onFocusChange: (Boolean) -> Unit,
    onClearClick: () -> Unit
) {
    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier
            .fillMaxWidth()
            .height(44.dp)
            .background(ColorInputBg, RoundedCornerShape(22.dp))
            .onFocusChanged { onFocusChange(it.isFocused) },
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
private fun SectionTitle(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.titleMedium.copy(
            fontWeight = FontWeight.Bold,
            color = ColorDarkText
        ),
        modifier = Modifier.padding(bottom = 12.dp)
    )
}

@Composable
private fun RecentSearchItem(text: String, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(Icons.Default.History, null, tint = Color.Gray, modifier = Modifier.size(20.dp))
        Spacer(modifier = Modifier.width(12.dp))
        Text(text, color = ColorDarkText, fontSize = 16.sp)
        Spacer(modifier = Modifier.weight(1f))
        Icon(Icons.Default.Close, null, tint = Color.LightGray, modifier = Modifier.size(16.dp))
    }
}

@Composable
private fun TagItem(tag: String, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Icono de Hash con fondo
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(ColorInputBg, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.Tag, null, tint = ColorDarkText)
        }
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = "#$tag", // Añadimos el # visualmente
            style = MaterialTheme.typography.bodyLarge.copy(
                fontWeight = FontWeight.Bold,
                color = ColorDarkText
            )
        )
    }
}