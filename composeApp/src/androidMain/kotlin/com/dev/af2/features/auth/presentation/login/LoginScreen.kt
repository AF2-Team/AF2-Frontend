package com.dev.af2.features.auth.presentation.login

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import org.jetbrains.compose.resources.painterResource

import com.dev.af2.features.auth.presentation.forgotpassword.ForgotPasswordPage
import com.dev.af2.core.designsystem.getAlegreyaFontFamily
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.logo_black_stroke // El mismo logo
import com.dev.af2.MainScreen
import cafe.adriel.voyager.core.model.ScreenModel
import cafe.adriel.voyager.core.model.screenModelScope
import androidx.compose.runtime.collectAsState
import cafe.adriel.voyager.core.model.rememberScreenModel
import com.dev.af2.features.auth.presentation.register.RegisterPage

// --- PALETA DE COLORES (Consistente con Registro) ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorInputBg = Color(0xFFFAF7F7)
private val ColorInputBorder = Color(0xFF918991)
private val ColorButton = Color(0xFFBCA1BD)
private val ColorError = Color(0xFFEF4444)

class LoginPage : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        val screenModel = rememberScreenModel { LoginScreenModel() } // O getScreenModel()
        val state by screenModel.state.collectAsState()

        LaunchedEffect(state.isSuccess) {
            if (state.isSuccess) {
                // AQUÍ ES DONDE ENTRAS A LA APP REAL
                 navigator.replaceAll(MainScreen())
                println("LOGIN EXITOSO: Navegando al Home...")

            }
        }

        LoginScreen(
            state = state,
            onLoginClick = { email, pass -> screenModel.login(email, pass) },
            onRegisterClick = { navigator.push(RegisterPage()) },
            onForgotPasswordClick = { navigator.push(ForgotPasswordPage()) },
            onClearError = { screenModel.clearErrors() }
        )
    }
}

@Composable
fun LoginScreen(
    state: LoginUiState,
    onLoginClick: (String, String) -> Unit,
    onRegisterClick: () -> Unit,
    onForgotPasswordClick: () -> Unit,
    onClearError: () -> Unit
) {
    val scrollState = rememberScrollState()
    val focusManager = LocalFocusManager.current
    val alegreyaFamily = getAlegreyaFontFamily()

    // Estados del formulario
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ColorBgWhite)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = 24.dp, vertical = 12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            // --- 1. LOGOTIPO ---
            // Mismo tamaño que en Registro para consistencia
            Box(modifier = Modifier.size(220.dp)) {
                Image(
                    painter = painterResource(Res.drawable.logo_black_stroke),
                    contentDescription = "Logo",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Fit
                )
            }

            Spacer(modifier = Modifier.height(0.dp))

            // --- 2. TÍTULO ---
            Text(
                text = "Bienvenido de nuevo", // O "Iniciar Sesión"
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontFamily = alegreyaFamily,
                    fontSize = 28.sp,
                    fontStyle = FontStyle.Italic,
                    fontWeight = FontWeight.Medium,
                    color = Color.Black
                )
            )

            Spacer(modifier = Modifier.height(30.dp))

            // --- 3. FORMULARIO ---
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(16.dp) // Un poco más de aire que en registro
            ) {

                if (state.generalError != null) {
                    Text(
                        text = state.generalError,
                        color = ColorError,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                }
                // Email
                ReactStyleInput(
                    label = "Dirección de correo",
                    placeholder = "ejemplo:correo@gmail.com",
                    value = email,
                    onValueChange = { email = it },
                    keyboardType = KeyboardType.Email,
                    errorMessage =  state.emailError
                )

                // Contraseña
                ReactStyleInput(
                    label = "Contraseña",
                    placeholder = "********",
                    value = password,
                    onValueChange = { password = it },
                    isPassword = true,
                    errorMessage = state.passwordError
                )

                // Enlace "Olvidaste tu contraseña"
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.CenterEnd
                ) {
                    Text(
                        text = "¿Olvidaste tu contraseña?",
                        color = ColorDarkText,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Normal,
                        textDecoration = TextDecoration.Underline,
                        modifier = Modifier
                            .clickable { onForgotPasswordClick() }
                            .padding(vertical = 4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            // --- 4. BOTÓN DE LOGIN ---
            Button(
                onClick = {
                    if (email.isNotBlank() && password.isNotBlank()) {
                        onLoginClick(email, password)
                    }
                },
                enabled = !state.isLoading,
                colors = ButtonDefaults.buttonColors(
                    containerColor = ColorButton,
                    contentColor = ColorDarkText
                ),
                shape = RoundedCornerShape(30.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                elevation = ButtonDefaults.buttonElevation(0.dp)
            ) {
                if (state.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = ColorDarkText, // Usamos color oscuro para que contraste
                        strokeWidth = 2.dp
                    )
                } else {
                    Text(
                        text = "INICIAR SESIÓN",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = ColorDarkText,
                        letterSpacing = 1.sp
                    )
                }
                }

            Spacer(modifier = Modifier.height(24.dp))

            // --- 5. ENLACE A REGISTRO ---
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "¿Aún no tienes cuenta?",
                    color = ColorDarkText,
                    fontSize = 14.sp
                )
                Text(
                    text = "Regístrate ahora",
                    color = ColorDarkText,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    textDecoration = TextDecoration.Underline,
                    modifier = Modifier
                        .clickable { onRegisterClick() }
                        .padding(top = 4.dp)
                )
            }
        }
    }
}

// --- COMPONENTE INPUT ESTILO REACT (Reutilizado) ---
// Idealmente, mueve esto a un archivo 'SharedComponents.kt'
@Composable
private fun ReactStyleInput(
    label: String,
    placeholder: String,
    value: String,
    onValueChange: (String) -> Unit,
    isPassword: Boolean = false,
    keyboardType: KeyboardType = KeyboardType.Text,
    imeAction: ImeAction = ImeAction.Next,
    onAction: () -> Unit = {},
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

        // Contenedor del Input (BasicTextField para control total de altura y padding)
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .height(40.dp) // Altura compacta consistente con el registro
                .background(ColorInputBg, RoundedCornerShape(12.dp))
                .border(
                    width = 1.dp,
                    color = if (errorMessage != null) ColorError else if (isFocused) ColorButton else ColorInputBorder,
                    shape = RoundedCornerShape(12.dp)
                )
                .onFocusChanged { isFocused = it.isFocused },
            textStyle = TextStyle(
                color = ColorDarkText,
                fontSize = 15.sp, // Tamaño de letra ajustado
                fontFamily = MaterialTheme.typography.bodyLarge.fontFamily,
                fontWeight = FontWeight.Normal
            ),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType, imeAction = imeAction),
            keyboardActions = KeyboardActions(onDone = { onAction() }, onNext = { onAction() }),
            visualTransformation = if (isPassword && !isPasswordVisible) PasswordVisualTransformation() else VisualTransformation.None,
            cursorBrush = SolidColor(ColorButton),
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
                                fontSize = 14.sp // Placeholder ajustado
                            )
                        }
                        innerTextField()
                    }

                    if (isPassword) {
                        IconButton(
                            onClick = { isPasswordVisible = !isPasswordVisible },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(
                                imageVector = if (isPasswordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                contentDescription = "Toggle Password",
                                tint = ColorDarkText,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }
            }
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