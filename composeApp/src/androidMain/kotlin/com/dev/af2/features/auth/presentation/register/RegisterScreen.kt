package com.dev.af2.features.auth.presentation.register

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import org.jetbrains.compose.resources.painterResource
import androidx.compose.foundation.text.KeyboardActions
import com.dev.af2.core.designsystem.getAlegreyaFontFamily
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.logo_black_stroke
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.foundation.border
import com.dev.af2.features.auth.presentation.login.LoginPage
import cafe.adriel.voyager.core.model.rememberScreenModel
import androidx.compose.runtime.collectAsState

// --- PALETA DE COLORES ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorInputBg = Color(0xFFFAF7F7)
private val ColorInputBorder = Color(0xFF918991)
private val ColorButton = Color(0xFFBCA1BD)
private val ColorError = Color(0xFFEF4444)

class RegisterPage : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow

        val screenModel = rememberScreenModel { RegisterScreenModel() }
        val state by screenModel.state.collectAsState()

        LaunchedEffect(state.isSuccess) {
            if (state.isSuccess) {
                navigator.push(RegisterSuccessPage())
            }
        }

        RegisterScreen(
            state = state,
            onRegisterClick = { name, email, username, password->
                screenModel.register(name, email, username, password)
            },
            onLoginClick = { navigator.push(LoginPage()) },
            onClearError={ screenModel.clearErrors() }
        )
    }
}

@Composable
fun RegisterScreen(
    state: RegisterUiState,
    onRegisterClick: (String, String, String, String) -> Unit,
    onLoginClick: () -> Unit,
    onClearError: () -> Unit,

) {
    val scrollState = rememberScrollState()
    val focusManager = LocalFocusManager.current
    val alegreyaFamily = getAlegreyaFontFamily()

    // Estados del formulario
    var fullName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    // Errores
    var confirmPasswordError by remember { mutableStateOf<String?>(null) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ColorBgWhite)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = 16.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            Spacer(modifier = Modifier.height(0.dp))

            Box(modifier = Modifier.size(220.dp)) {
                Image(
                    painter = painterResource(Res.drawable.logo_black_stroke),
                    contentDescription = "Logo",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Fit
                )
            }
            Spacer(modifier = Modifier.height(0.dp))


            // --- TÍTULO ---
            Text(
                text = "Crear una cuenta",
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontFamily = alegreyaFamily,
                    fontSize = 28.sp,
                    fontStyle = FontStyle.Italic,
                    fontWeight = FontWeight.Medium,
                    color = Color.Black
                )
            )

            Spacer(modifier = Modifier.height(10.dp))

            // --- FORMULARIO ---
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(2.dp)
            ) {
                if (state.generalError != null) {
                    Text(
                        text = state.generalError,
                        color = ColorError,
                        fontSize = 14.sp,
                        modifier = Modifier.padding(bottom = 8.dp),
                        fontWeight = FontWeight.Bold
                    )
                }



                ReactStyleInput(
                    label = "Nombre y Apellido",
                    placeholder = "Alirio Freytez",
                    value = fullName,
                    onValueChange = { fullName = it;onClearError() }
                )


                ReactStyleInput(
                    label = "Nombre de usuario",
                    placeholder = "alirio_dev",
                    value = username,
                    onValueChange = { username = it; onClearError() },
                    errorMessage = state.usernameError

                )

                ReactStyleInput(
                    label = "Dirección de correo",
                    placeholder = "ejemplo:correo@gmail.com",
                    value = email,
                    onValueChange = { email = it; onClearError() },
                    keyboardType = KeyboardType.Email,
                    errorMessage = state.emailError
                )

                ReactStyleInput(
                    label = "Contraseña",
                    placeholder = "Contraseña",
                    value = password,
                    onValueChange = { password = it },
                    isPassword = true
                )

                ReactStyleInput(
                    label = "Confirmar Contraseña",
                    placeholder = "Confirmar Contraseña",
                    value = confirmPassword,
                    onValueChange = {
                        confirmPassword = it
                        confirmPasswordError = if (it != password) "Las contraseñas no coinciden" else null
                    },
                    isPassword = true,
                    imeAction = ImeAction.Done,
                    onAction = { focusManager.clearFocus() },
                    errorMessage = confirmPasswordError
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            // --- BOTÓN DE REGISTRO ---
            Button(
                onClick = {
                    println("DEBUG_UI: --- INTENTO DE REGISTRO ---")

                    // Imprimimos el valor actual de cada campo
                    println("DEBUG_UI: Nombre: '$fullName'")
                    println("DEBUG_UI: Usuario: '$username'")
                    println("DEBUG_UI: Email: '$email'")
                    println("DEBUG_UI: Password: '$password'")
                    println("DEBUG_UI: Confirmar: '$confirmPassword'")

                    // Validaciones individuales
                    val nameValid = fullName.isNotBlank()
                    val userValid = username.isNotBlank()
                    val emailValid = email.isNotBlank()
                    val passValid = password.isNotBlank()
                    val passMatch = password == confirmPassword

                    // Reporte de errores
                    if (!nameValid) println("DEBUG_UI: ❌ Error: El nombre está vacío")
                    if (!userValid) println("DEBUG_UI: ❌ Error: El usuario está vacío (¿Agregaste el Input visual para el usuario?)")
                    if (!emailValid) println("DEBUG_UI: ❌ Error: El email está vacío")
                    if (!passValid) println("DEBUG_UI: ❌ Error: La contraseña está vacía")
                    if (!passMatch) println("DEBUG_UI: ❌ Error: Las contraseñas NO coinciden")

                    val isValid = nameValid && userValid && emailValid && passValid && passMatch

                    if (isValid) {
                        println("DEBUG_UI: ✅ TODO VALIDO. Enviando petición...")
                        onRegisterClick(fullName, email, username, password)
                    } else {
                        println("DEBUG_UI: ⛔ VALIDACIÓN FALLIDA. No se enviará nada.")
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
                        color = ColorDarkText,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text(
                        text = "CREAR TU CUENTA",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = ColorDarkText,
                        letterSpacing = 1.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // --- ENLACES LOGIN ---
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "¿Ya eres miembro?",
                    color = ColorDarkText,
                    fontSize = 14.sp
                )
                Text(
                    text = "Inicia sesión ahora",
                    color = ColorDarkText,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    textDecoration = TextDecoration.Underline,
                    modifier = Modifier
                        .clickable { onLoginClick() }
                        .padding(top = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

// --- COMPONENTE INPUT ESTILO REACT ---
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

    // Estados para simular el foco del borde (como en CSS focus:border)
    var isFocused by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxWidth()) {

        // Label
        Text(
            text = label,
            color = Color.Black,
            fontSize = 13.sp,
            modifier = Modifier.padding(bottom = 4.dp),
            fontWeight = FontWeight.Bold
        )

        // Contenedor del Input (Simulamos el borde y fondo aquí)
        val isError = errorMessage != null
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .height(40.dp) // Altura exacta
                .background(ColorInputBg, RoundedCornerShape(12.dp))
                .border(
                    width = 1.dp,
                    color = if (isError == true) ColorError else if (isFocused) ColorButton else ColorInputBorder,
                    shape = RoundedCornerShape(12.dp)
                )
                .onFocusChanged { isFocused = it.isFocused }, // Detectar foco
            textStyle = TextStyle(
                color = ColorDarkText,
                fontSize = 15.sp,
                fontFamily = MaterialTheme.typography.bodyLarge.fontFamily,
                fontWeight = FontWeight.Normal
            ),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType, imeAction = imeAction),
            keyboardActions = KeyboardActions(onDone = { onAction() }, onNext = { onAction() }),
            visualTransformation = if (isPassword && !isPasswordVisible) PasswordVisualTransformation() else VisualTransformation.None,
            cursorBrush = SolidColor(ColorButton), // Color del cursor
            decorationBox = { innerTextField ->
                // Row para alinear contenido: Texto a la izq, Icono a la der
                Row(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 12.dp), // Padding lateral interno
                    verticalAlignment = Alignment.CenterVertically // ESTO CENTRA EL TEXTO VERTICALMENTE
                ) {
                    Box(modifier = Modifier.weight(1f)) {
                        // Placeholder (se muestra si está vacío)
                        if (value.isEmpty()) {
                            Text(
                                text = placeholder,
                                color = Color.Gray.copy(alpha = 0.6f),
                                fontSize = 14.sp
                            )
                        }
                        // El campo de texto real
                        innerTextField()
                    }

                    // Icono de Ojo (Trailing Icon)
                    if (isPassword) {
                        IconButton(
                            onClick = { isPasswordVisible = !isPasswordVisible },
                            modifier = Modifier.size(24.dp)
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

        // Mensaje de Error
        if (errorMessage != null) {
            Text(
                text = errorMessage,
                color = ColorError,
                fontSize = 13.sp,
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}