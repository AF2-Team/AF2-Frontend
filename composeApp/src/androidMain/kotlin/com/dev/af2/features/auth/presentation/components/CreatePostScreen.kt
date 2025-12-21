package com.dev.af2.features.auth.presentation.components


import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddPhotoAlternate
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import org.jetbrains.compose.resources.painterResource
import coil3.compose.AsyncImage
import com.dev.af2.features.auth.data.PostRepository
import cafe.adriel.voyager.navigator.tab.TabNavigator// Imports de tu proyecto
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.image_profile

// --- COLORES ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorButton = Color(0xFFBCA1BD)
private val ColorPlaceholder = Color(0xFFF0F0F0)

class CreatePostPage : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow


        CreatePostScreen(
            onCloseClick = { navigator.pop()},
            onPostClick = { description, imageUri ->
                PostRepository.addPost(description, imageUri)
                navigator.pop()
            }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreatePostScreen(
    onCloseClick: () -> Unit,
    onPostClick: (String, Uri?) -> Unit // Usamos Uri de Android
) {
    val openSansFamily = getOpenSansFontFamily()

    // Estados
    var description by remember { mutableStateOf("") }
    var selectedImageUri by remember { mutableStateOf<Uri?>(null) }

    // --- SELECTOR DE GALERÍA (ANDROID NATIVO) ---
    // Usamos el contrato estándar de Android para abrir el selector de fotos
    val singlePhotoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia(),
        onResult = { uri -> selectedImageUri = uri }
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "Crear Publicación",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = ColorDarkText
                        )
                    )
                },
                navigationIcon = {
                    // Botón para cancelar/cerrar la pantalla
                    IconButton(onClick = onCloseClick) {
                        Icon(Icons.Default.Close, contentDescription = "Cerrar", tint = ColorDarkText)
                    }
                },
                actions = {
                    // Botón "Publicar" (Solo activo si hay contenido)
                    TextButton(
                        onClick = {
                            onPostClick(description, selectedImageUri)

                            onCloseClick()},
                        enabled = description.isNotBlank() || selectedImageUri != null,
                        colors = ButtonDefaults.textButtonColors(
                            contentColor = ColorButton,
                            disabledContentColor = Color.Gray
                        )
                    ) {
                        Text(
                            "Publicar",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = ColorBgWhite)
            )
        },
        containerColor = ColorBgWhite
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {

            // 1. HEADER: Avatar + Input de Texto
            Row(modifier = Modifier.fillMaxWidth()) {
                // Avatar del usuario actual (Placeholder)
                Image(
                    painter = painterResource(Res.drawable.image_profile),
                    contentDescription = null,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Color.LightGray),
                    contentScale = ContentScale.Crop
                )

                Spacer(modifier = Modifier.width(12.dp))

                // Campo de texto sin bordes (Estilo "What's on your mind?")
                TextField(
                    value = description,
                    onValueChange = { description = it },
                    placeholder = {
                        Text(
                            "¿Qué estás pensando?",
                            color = Color.Gray,
                            fontFamily = openSansFamily,
                            fontSize = 18.sp
                        )
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Color.Transparent,
                        unfocusedContainerColor = Color.Transparent,
                        focusedIndicatorColor = Color.Transparent, // Sin línea inferior
                        unfocusedIndicatorColor = Color.Transparent,
                        cursorColor = ColorButton
                    ),
                    textStyle = MaterialTheme.typography.bodyLarge.copy(
                        color = ColorDarkText,
                        fontSize = 16.sp
                    )
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 2. ÁREA DE IMAGEN (Selector o Previsualización)
            if (selectedImageUri == null) {
                // ESTADO VACÍO: Botón grande para abrir galería
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(250.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(ColorPlaceholder)
                        .clickable {
                            // Lanzamos el selector de imágenes
                            singlePhotoPickerLauncher.launch(
                                PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                            )
                        }
                        .border(1.dp, Color.LightGray, RoundedCornerShape(12.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.AddPhotoAlternate,
                            contentDescription = "Agregar foto",
                            tint = Color.Gray,
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Agregar foto/video",
                            color = Color.Gray,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            } else {
                // ESTADO CON IMAGEN: Previsualización + Botón Borrar
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .wrapContentHeight()
                        .clip(RoundedCornerShape(12.dp))
                        .border(1.dp, Color.LightGray.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                ) {
                    // Usamos AsyncImage de Coil para cargar la URI del dispositivo
                    AsyncImage(
                        model = selectedImageUri,
                        contentDescription = "Imagen seleccionada",
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 400.dp), // Altura máxima para no ocupar toda la pantalla
                        contentScale = ContentScale.Crop
                    )

                    // Botón "X" para quitar la imagen (Borrar del post actual)
                    IconButton(
                        onClick = { selectedImageUri = null },
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(8.dp)
                            .background(Color.Black.copy(alpha = 0.6f), CircleShape)
                            .size(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Eliminar imagen",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}