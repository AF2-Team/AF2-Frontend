package com.dev.af2.features.auth.presentation.register

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow

// Imports de tu proyecto
import com.dev.af2.core.designsystem.getAlegreyaFontFamily
import com.dev.af2.MainScreen

// --- PALETA DE COLORES ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val ColorButton = Color(0xFFBCA1BD)
private val ColorSuccess = Color(0xFF8BC34A) // Un verde suave o usa el rosa de la marca si prefieres

data class RegistrationCompletedPage(val username: String) : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        RegistrationCompletedScreen(
            username = username,
            onFinishClick = {
                // Ahora sí, vamos al Login limpiando todo el historial
                navigator.popUntilRoot()
                navigator.push(MainScreen())
            }
        )
    }
}

@Composable
fun RegistrationCompletedScreen(
    username: String,
    onFinishClick: () -> Unit
) {
    val alegreyaFamily = getAlegreyaFontFamily()

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

            // 1. ÍCONO DE ÉXITO
            Icon(
                imageVector = Icons.Default.CheckCircle,
                contentDescription = "Éxito",
                tint = ColorButton, // Usamos el color de marca para consistencia
                modifier = Modifier.size(120.dp)
            )

            Spacer(modifier = Modifier.height(32.dp))

            // 2. TÍTULO DE BIENVENIDA
            Text(
                text = "¡Genial, $username!",
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontFamily = alegreyaFamily,
                    fontSize = 34.sp,
                    fontStyle = FontStyle.Italic,
                    fontWeight = FontWeight.Bold,
                    color = ColorDarkText,
                    textAlign = TextAlign.Center
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            // 3. MENSAJE FINAL
            Text(
                text = "Tu registro se ha completado correctamente. Ahora puedes iniciar sesión con tu cuenta.",
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontSize = 16.sp,
                    color = Color.Gray,
                    textAlign = TextAlign.Center
                ),
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            Spacer(modifier = Modifier.height(48.dp))

            // 4. BOTÓN FINALIZAR
            Button(
                onClick = onFinishClick,
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
                    text = "IR AL INICIO DE SESIÓN",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = ColorDarkText,
                    letterSpacing = 1.sp
                )
            }
        }
    }
}