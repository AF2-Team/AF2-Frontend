package com.dev.af2.features.auth.presentation.settings.changeusername


import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import kotlinx.coroutines.delay

import com.dev.af2.core.designsystem.getAlegreyaFontFamily

private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)   // Texto oscuro marca
private val ColorInputBg = Color(0xFFFAF7F7)    // Fondo gris input
private val ColorInputBorder = Color(0xFF918991)// Borde gris input
private val ColorBrand = Color(0xFFBCA1BD)      // Color principal (Botón)
private val ColorBlueSuccess = Color(0xFF1DA1F2) // Azul para éxito
private val ColorError = Color(0xFFEF4444)      // Rojo error
private val ColorGrayText = Color(0xFF888888)

class ChangeUsernamePage : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        ChangeUsernameScreen(
            onBackClick = { navigator.pop() }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChangeUsernameScreen(
    onBackClick: () -> Unit
) {
    val alegreyaFamily = getAlegreyaFontFamily()
    val scrollState = rememberScrollState()

    // Estados
    var currentUsername by remember { mutableStateOf("Luis Carrillo") } // Simulado
    var newUsername by remember { mutableStateOf("") }

    // Estados UI
    var isLoading by remember { mutableStateOf(false) }
    var isSuccess by remember { mutableStateOf(false) }

    // Validaciones (Ejemplo simple)
    val isValid = newUsername.isNotBlank() && newUsername != currentUsername && newUsername.length >= 3

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        "Cambiar Nombre",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontFamily = alegreyaFamily,
                            fontStyle = FontStyle.Italic, // Fiel al estilo Register
                            fontWeight = FontWeight.Medium,
                            color = ColorDarkText,
                            fontSize = 24.sp
                        )
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Atrás",
                            tint = ColorDarkText
                        )
                    }
                },
                actions = {
                    // BOTÓN GUARDAR / LOADING / ÉXITO EN EL TOPBAR
                    Box(modifier = Modifier.padding(end = 8.dp)) {
                        AnimatedContent(
                            targetState = when {
                                isSuccess -> "Success"
                                isLoading -> "Loading"
                                else -> "Button"
                            },
                            transitionSpec = { fadeIn() togetherWith fadeOut() }
                        ) { state ->
                            when (state) {
                                "Button" -> {
                                    TextButton(
                                        onClick = {
                                            isLoading = true
                                            // Simulación
                                        },
                                        enabled = isValid,
                                        colors = ButtonDefaults.textButtonColors(
                                            contentColor = ColorBrand, // Morado marca
                                            disabledContentColor = Color.LightGray
                                        )
                                    ) {
                                        Text("Guardar", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                    }
                                }
                                "Loading" -> {
                                    CircularProgressIndicator(
                                        modifier = Modifier.size(24.dp).padding(4.dp),
                                        color = ColorBlueSuccess,
                                        strokeWidth = 2.dp
                                    )
                                    LaunchedEffect(Unit) {
                                        delay(2000)
                                        isLoading = false
                                        isSuccess = true
                                    }
                                }
                                "Success" -> {
                                    Text(
                                        "¡Listo!", // Mensaje corto para TopBar
                                        color = ColorBlueSuccess,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 16.sp,
                                        modifier = Modifier.padding(horizontal = 12.dp)
                                    )
                                }
                            }
                        }
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = ColorBgWhite)
            )
        },
        containerColor = ColorBgWhite
    ) { paddingValues ->

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(scrollState)
                .padding(horizontal = 24.dp, vertical = 16.dp)
        ) {
            // Instrucciones
            Text(
                text = "Elige un nombre de usuario único. Podrás cambiarlo nuevamente en 30 días.",
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = ColorGrayText,
                    lineHeight = 20.sp
                ),
                modifier = Modifier.padding(bottom = 24.dp)
            )

            // Input: Nuevo Nombre
            ReactStyleTextInput(
                label = "Nuevo nombre de usuario",
                placeholder = "Ej. @luiscarrillo",
                value = newUsername,
                onValueChange = { newUsername = it },
                imeAction = ImeAction.Done,
                isError = false // Podrías añadir lógica de error si el usuario ya existe
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Nota informativa
            Text(
                text = "Nombre actual: $currentUsername",
                style = MaterialTheme.typography.bodySmall.copy(
                    color = ColorGrayText,
                    fontSize = 12.sp
                ),
                modifier = Modifier.padding(start = 4.dp)
            )

            // Mensaje completo de éxito (si quieres que aparezca abajo también)
            if (isSuccess) {
                Spacer(modifier = Modifier.height(24.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = null,
                        tint = ColorBlueSuccess,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Nombre actualizado correctamente",
                        color = ColorBlueSuccess,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                }
            }
        }
    }
}

// --- INPUT TEXTO ESTILO REACT (Reutilizado y adaptado para no ser password) ---
@Composable
private fun ReactStyleTextInput(
    label: String,
    placeholder: String,
    value: String,
    onValueChange: (String) -> Unit,
    imeAction: ImeAction,
    isError: Boolean = false,
    errorMessage: String? = null
) {
    var isFocused by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxWidth()) {
        // Label externa negra
        Text(
            text = label,
            color = Color.Black,
            fontSize = 13.sp,
            modifier = Modifier.padding(bottom = 4.dp),
            fontWeight = FontWeight.Bold
        )

        // BasicTextField con altura fija y bordes manuales
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp) // Altura idéntica al registro
                .background(ColorInputBg, RoundedCornerShape(12.dp))
                .onFocusChanged { isFocused = it.isFocused },
            textStyle = TextStyle(
                color = ColorDarkText,
                fontSize = 15.sp, // Tamaño letra consistente
                fontWeight = FontWeight.Normal
            ),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text, imeAction = imeAction),
            cursorBrush = SolidColor(ColorBrand),
            decorationBox = { innerTextField ->
                Row(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(modifier = Modifier.weight(1f)) {
                        if (value.isEmpty()) {
                            Text(
                                text = placeholder,
                                color = Color.Gray.copy(alpha = 0.6f),
                                fontSize = 14.sp
                            )
                        }
                        innerTextField()
                    }
                }
            }
        )
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(1.dp) // Grosor de la línea
                // Cambiamos el color de la línea basándonos en el estado, igual que antes.
                .background(if (isError) ColorError else if (isFocused) ColorBrand else ColorInputBorder)
        )
        if (errorMessage != null) {
            Text(
                text = errorMessage,
                color = ColorError,
                fontSize = 12.sp,
                modifier = Modifier.padding(top = 2.dp)
            )
        }
    }
}