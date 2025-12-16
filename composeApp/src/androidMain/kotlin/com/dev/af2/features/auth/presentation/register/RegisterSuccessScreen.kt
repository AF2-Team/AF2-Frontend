package com.dev.af2.features.auth.presentation.register

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
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
import com.dev.af2.features.auth.presentation.register.RegistrationCompletedPage
import com.dev.af2.core.designsystem.getAlegreyaFontFamily
import af2.composeapp.generated.resources.Res
 // Reutilizamos el logo

// --- PALETA DE COLORES ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorButton = Color(0xFFBCA1BD)
private val ColorInputBg = Color(0xFFFAF7F7)
private val ColorInputBorder = Color(0xFF918991)

class RegisterSuccessPage : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow

        RegisterSuccessScreen(
            onContinueClick = { username ->
                println("Usuario guardado como: $username")
                // Aquí guardarías el username en tu ViewModel/Backend

                navigator.popUntilRoot()
                navigator.push(RegistrationCompletedPage(username))
            }
        )
    }
}

@Composable
fun RegisterSuccessScreen(
    onContinueClick: (String) -> Unit
) {
    val alegreyaFamily = getAlegreyaFontFamily()

    // Estado para el nombre de usuario
    var username by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ColorBgWhite)
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {



            Spacer(modifier = Modifier.height(32.dp))

            // 2. PREGUNTA (Título)
            Text(
                text = "¿Cómo quieres llamarte?",
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontFamily = alegreyaFamily,
                    fontSize = 35.sp,
                    fontStyle = FontStyle.Italic,
                    fontWeight = FontWeight.Bold,
                    color = ColorDarkText,
                    textAlign = TextAlign.Center
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            // 3. EXPLICACIÓN
            Text(
                text = "Elige un nombre de usuario único para que los demás te reconozcan.",
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontSize = 15.sp,
                    color = Color.Gray,
                    textAlign = TextAlign.Center
                ),
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            Spacer(modifier = Modifier.height(32.dp))

            // 4. INPUT DE USERNAME (Reutilizando estilo React)
            UsernameInput(
                value = username,
                onValueChange = { username = it },
                onDone = { if (username.isNotBlank()) onContinueClick(username) }
            )

            Spacer(modifier = Modifier.height(48.dp))

            // 5. BOTÓN DE CONTINUAR
            Button(
                onClick = { onContinueClick(username) },
                enabled = username.isNotBlank(), // Deshabilitado si está vacío
                colors = ButtonDefaults.buttonColors(
                    containerColor = ColorButton,
                    contentColor = ColorDarkText,
                    disabledContainerColor = ColorButton.copy(alpha = 0.5f),
                    disabledContentColor = ColorDarkText.copy(alpha = 0.5f)
                ),
                shape = RoundedCornerShape(30.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                elevation = ButtonDefaults.buttonElevation(0.dp)
            ) {
                Text(
                    text = "CONTINUAR",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
            }
        }
    }
}

// --- Componente Input Específico para Username ---
@Composable
private fun UsernameInput(
    value: String,
    onValueChange: (String) -> Unit,
    onDone: () -> Unit
) {
    var isFocused by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Nombre de usuario",
            color = ColorDarkText,
            fontSize = 13.sp,
            modifier = Modifier.padding(bottom = 6.dp),
            fontWeight = FontWeight.Bold
        )

        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
                .background(ColorInputBg, RoundedCornerShape(12.dp))
                .border(
                    width = 1.dp,
                    color = if (isFocused) ColorButton else ColorInputBorder,
                    shape = RoundedCornerShape(12.dp)
                )
                .onFocusChanged { isFocused = it.isFocused },
            textStyle = TextStyle(
                color = ColorDarkText,
                fontSize = 16.sp,
                fontWeight = FontWeight.Normal,
                textAlign = TextAlign.Start
            ),
            singleLine = true,
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Text,
                imeAction = ImeAction.Done
            ),
            keyboardActions = KeyboardActions(onDone = { onDone() }),
            cursorBrush = SolidColor(ColorButton),
            decorationBox = { innerTextField ->
                Row(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(modifier = Modifier.weight(1f)) {
                        if (value.isEmpty()) {
                            Text(
                                text = "@usuario",
                                color = Color.Gray.copy(alpha = 0.5f),
                                fontSize = 16.sp
                            )
                        }
                        innerTextField()
                    }
                }
            }
        )
    }
}