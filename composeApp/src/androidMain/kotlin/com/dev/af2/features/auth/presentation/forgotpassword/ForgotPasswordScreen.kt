package com.dev.af2.features.auth.presentation.forgotpassword

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
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import org.jetbrains.compose.resources.painterResource

// Imports de tu proyecto
import com.dev.af2.core.designsystem.getAlegreyaFontFamily
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.logo_black_stroke

// --- PALETA DE COLORES (Consistente) ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorInputBg = Color(0xFFFAF7F7)
private val ColorInputBorder = Color(0xFF918991)
private val ColorButton = Color(0xFFBCA1BD)
private val ColorError = Color(0xFFEF4444)

class ForgotPasswordPage : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        ForgotPasswordScreen(
            onBackClick = { navigator.pop() },
            onSubmitClick = { email ->
                println("Recuperar para: $email")
                // Aquí podrías navegar a una pantalla de confirmación o mostrar un Toast/Snackbar
                // navigator.push(ResetPasswordSuccessPage())
            }
        )
    }
}

@Composable
fun ForgotPasswordScreen(
    onBackClick: () -> Unit,
    onSubmitClick: (String) -> Unit
) {
    val scrollState = rememberScrollState()
    val alegreyaFamily = getAlegreyaFontFamily()

    var email by remember { mutableStateOf("") }
    var emailError by remember { mutableStateOf<String?>(null) }

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

            // --- HEADER: Botón Atrás (Alineado a la izquierda) ---
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                IconButton(onClick = onBackClick) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Volver",
                        tint = ColorDarkText
                    )
                }
            }

            // --- 1. LOGO (Más pequeño para dar prioridad al mensaje) ---
            Box(modifier = Modifier.size(250.dp)) {
                Image(
                    painter = painterResource(Res.drawable.logo_black_stroke),
                    contentDescription = "Logo",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Fit
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // --- 2. TÍTULO Y DESCRIPCIÓN ---
            Text(
                text = "Recuperar Contraseña",
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontFamily = alegreyaFamily,
                    fontSize = 28.sp,
                    fontStyle = FontStyle.Italic,
                    fontWeight = FontWeight.Medium,
                    color = Color.Black
                )
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.",
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = Color.Gray,
                    fontSize = 14.sp,
                    textAlign = TextAlign.Center
                ),
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            Spacer(modifier = Modifier.height(32.dp))

            // --- 3. FORMULARIO ---
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                ReactStyleInput(
                    label = "Dirección de correo",
                    placeholder = "ejemplo:correo@gmail.com",
                    value = email,
                    onValueChange = {
                        email = it
                        emailError = null // Limpiar error al escribir
                    },
                    keyboardType = KeyboardType.Email,
                    imeAction = ImeAction.Done,
                    onAction = { onSubmitClick(email) },
                    errorMessage = emailError
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            // --- 4. BOTÓN DE ACCIÓN ---
            Button(
                onClick = {
                    if (email.isNotBlank() && email.contains("@")) {
                        onSubmitClick(email)
                    } else {
                        emailError = "Ingresa un correo válido"
                    }
                },
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
                Text(
                    text = "ENVIAR INSTRUCCIONES",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = ColorDarkText,
                    letterSpacing = 1.sp
                )
            }
        }
    }
}

// --- COMPONENTE REUTILIZADO (INPUT COMPACTO) ---
// Nota: En un proyecto real, esto debería estar en un archivo separado 'SharedComponents.kt'
@Composable
private fun ReactStyleInput(
    label: String,
    placeholder: String,
    value: String,
    onValueChange: (String) -> Unit,
    keyboardType: KeyboardType = KeyboardType.Text,
    imeAction: ImeAction = ImeAction.Next,
    onAction: () -> Unit = {},
    errorMessage: String? = null
) {
    var isFocused by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = label,
            color = Color.Black,
            fontSize = 13.sp,
            modifier = Modifier.padding(bottom = 4.dp),
            fontWeight = FontWeight.Bold
        )

        // BasicTextField para control total
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .height(40.dp)
                .background(ColorInputBg, RoundedCornerShape(12.dp))
                .border(
                    width = 1.dp,
                    color = if (errorMessage != null) ColorError else if (isFocused) ColorButton else ColorInputBorder,
                    shape = RoundedCornerShape(12.dp)
                )
                .onFocusChanged { isFocused = it.isFocused },
            textStyle = TextStyle(
                color = ColorDarkText,
                fontSize = 15.sp,
                fontWeight = FontWeight.Normal
            ),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType, imeAction = imeAction),
            keyboardActions = KeyboardActions(onDone = { onAction() }, onNext = { onAction() }),
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
                                fontSize = 14.sp
                            )
                        }
                        innerTextField()
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

