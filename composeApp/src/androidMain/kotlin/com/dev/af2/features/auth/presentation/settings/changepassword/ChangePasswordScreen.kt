package com.dev.af2.features.auth.presentation.settings.changepassword

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
import androidx.compose.material.icons.filled.Circle
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
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
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import cafe.adriel.voyager.core.model.rememberScreenModel
import com.dev.af2.core.designsystem.getAlegreyaFontFamily
import kotlinx.coroutines.delay

// --- COLORES EXACTOS DEL REGISTER/LOGIN ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorInputBg = Color(0xFFF0F0F0) // Corregido: Faltaban 0s en tu código original
private val ColorInputBorder = Color(0xFF918991)
private val ColorBrand = Color(0xFFBCA1BD)
private val ColorBlueSuccess = Color(0xFF1DA1F2)
private val ColorError = Color(0xFFEF4444)
private val ColorGrayText = Color(0xFF888888)

class ChangePasswordPage : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        val screenModel = rememberScreenModel { ChangePasswordScreenModel() }
        val state by screenModel.state.collectAsState()

        // Lógica de navegación segura
        LaunchedEffect(state.isSuccess) {
            if (state.isSuccess) {
                delay(1500) // Esperamos un poco para que se vea el "¡Listo!"
                navigator.pop()
            }
        }

        ChangePasswordScreen(
            isLoading = state.isLoading,
            isSuccess = state.isSuccess,
            error = state.error,
            onSaveClick = { current, new, confirm ->
                screenModel.changePassword(current, new, confirm)
            },
            onBackClick = { navigator.pop() },
            onClearError = { screenModel.clearError() }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChangePasswordScreen(
    modifier: Modifier = Modifier,
    isLoading: Boolean,
    isSuccess: Boolean,
    error: String?,
    onSaveClick: (String, String, String) -> Unit,
    onBackClick: () -> Unit, // Agregado para que funcione el botón atrás
    onClearError: () -> Unit
) {
    val alegreyaFamily = getAlegreyaFontFamily()
    val scrollState = rememberScrollState()

    // Estados del Formulario
    var currentPassword by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    val isCurrentPasswordError = error?.contains("actual", ignoreCase = true) == true ||
            error?.contains("incorrecta", ignoreCase = true) == true


    // Validaciones
    val hasMinLength = newPassword.length >= 8
    val hasUpperCase = newPassword.any { it.isUpperCase() }
    val hasNumber = newPassword.any { it.isDigit() }
    val hasSpecialChar = newPassword.any { !it.isLetterOrDigit() }
    val passwordsMatch = newPassword.isNotEmpty() && newPassword == confirmPassword

    val isFormValid = currentPassword.isNotEmpty() &&
            hasMinLength && hasUpperCase && hasNumber && hasSpecialChar &&
            passwordsMatch

    // Limpiar error al escribir
    LaunchedEffect(currentPassword, newPassword, confirmPassword) {
        if (error != null) onClearError()
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        "Cambiar Contraseña",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontFamily = alegreyaFamily,
                            fontStyle = FontStyle.Italic,
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
                            transitionSpec = { fadeIn() togetherWith fadeOut() },
                            label = "ButtonAnimation"
                        ) { state ->
                            when (state) {
                                "Button" -> {
                                    TextButton(
                                        onClick = {
                                            onSaveClick(currentPassword, newPassword, confirmPassword)
                                        },
                                        enabled = isFormValid,
                                        colors = ButtonDefaults.textButtonColors(
                                            contentColor = ColorBrand,
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
                                }
                                "Success" -> {
                                    Text(
                                        "¡Listo!",
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
            // Mostrar Error Global si existe (del backend)
            if (error != null) {
                Text(
                    text = error,
                    color = ColorError,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(bottom = 16.dp).align(Alignment.CenterHorizontally)
                )
            }

            // Instrucciones
            Text(
                text = "Tu contraseña debe tener al menos 8 caracteres e incluir una combinación de números, letras y caracteres especiales.",
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = ColorGrayText,
                    lineHeight = 20.sp
                ),
                modifier = Modifier.padding(bottom = 24.dp)
            )

            // Input 1: Actual
            ReactStylePasswordInput(
                label = "Contraseña actual",
                value = currentPassword,
                onValueChange = { currentPassword = it },
                imeAction = ImeAction.Next,
                isError = isCurrentPasswordError,
                errorMessage = if (isCurrentPasswordError) error else null
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Input 2: Nueva
            ReactStylePasswordInput(
                label = "Nueva contraseña",
                value = newPassword,
                onValueChange = { newPassword = it },
                imeAction = ImeAction.Next
            )

            // Checklist de requisitos
            Spacer(modifier = Modifier.height(12.dp))
            Column(
                modifier = Modifier.padding(start = 4.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                RequirementItem(isMet = hasMinLength, text = "Mínimo 8 caracteres")
                RequirementItem(isMet = hasUpperCase, text = "Al menos una mayúscula")
                RequirementItem(isMet = hasNumber, text = "Al menos un número")
                RequirementItem(isMet = hasSpecialChar, text = "Al menos un carácter especial")
            }
            Spacer(modifier = Modifier.height(16.dp))

            // Input 3: Confirmar
            ReactStylePasswordInput(
                label = "Confirmar nueva contraseña",
                value = confirmPassword,
                onValueChange = { confirmPassword = it },
                imeAction = ImeAction.Done,
                isError = confirmPassword.isNotEmpty() && !passwordsMatch,
                errorMessage = if (confirmPassword.isNotEmpty() && !passwordsMatch) "Las contraseñas no coinciden" else null
            )
        }
    }
}

// --- COMPONENTES AUXILIARES (Sin cambios de estilo) ---

@Composable
private fun RequirementItem(isMet: Boolean, text: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            imageVector = if (isMet) Icons.Default.Check else Icons.Default.Circle,
            contentDescription = null,
            tint = if (isMet) ColorBlueSuccess else Color.LightGray,
            modifier = Modifier.size(if (isMet) 16.dp else 6.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = text,
            style = MaterialTheme.typography.bodySmall.copy(
                color = if (isMet) ColorDarkText else ColorGrayText,
                fontSize = 12.sp
            )
        )
    }
}

@Composable
private fun ReactStylePasswordInput(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    imeAction: ImeAction,
    isError: Boolean = false,
    errorMessage: String? = null
) {
    var isPasswordVisible by remember { mutableStateOf(false) }
    var isFocused by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = label,
            color = Color.Black,
            fontSize = 13.sp,
            modifier = Modifier.padding(bottom = 4.dp),
            fontWeight = FontWeight.Bold
        )

        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
                .background(ColorInputBg)
                .onFocusChanged { isFocused = it.isFocused },
            textStyle = TextStyle(
                color = ColorDarkText,
                fontSize = 15.sp,
                fontWeight = FontWeight.Normal
            ),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password, imeAction = imeAction),
            visualTransformation = if (!isPasswordVisible) PasswordVisualTransformation() else VisualTransformation.None,
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
                                text = "••••••••",
                                color = Color.Gray.copy(alpha = 0.6f),
                                fontSize = 14.sp,
                                letterSpacing = 2.sp
                            )
                        }
                        innerTextField()
                    }

                    IconButton(
                        onClick = { isPasswordVisible = !isPasswordVisible },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            imageVector = if (isPasswordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                            contentDescription = "Toggle",
                            tint = ColorDarkText,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        )

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(1.dp)
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