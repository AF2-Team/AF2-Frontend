package com.dev.af2.features.auth.presentation.welcome

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.jetbrains.compose.resources.painterResource

// --- IMPORTS DE TU PROYECTO ---
// Asegúrate de que tu package de recursos sea correcto (suele ser 'tuapp.generated.resources')
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.logo_black_stroke // IMPORTANTE: Debes tener esta imagen en drawables

// Importamos tus colores del Design System
import com.dev.af2.core.designsystem.SoftPink
import com.dev.af2.core.designsystem.DeepPurple
import com.dev.af2.core.designsystem.DarkBackground
import com.dev.af2.core.designsystem.ButtonPink
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import com.dev.af2.core.designsystem.getAlegreyaFontFamily
import com.dev.af2.features.auth.presentation.register.RegisterPage
import com.dev.af2.features.auth.presentation.login.LoginPage
// 1. Voyager Screen Wrapper
class WelcomePage : Screen {
    override val key: ScreenKey = uniqueScreenKey
    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow

        WelcomeScreen(
            onSignUpClick = {
                navigator.push(RegisterPage()) // Futura implementación
                println("Ir a Registro")
            },
            onLoginClick = {
              navigator.push(LoginPage())    // Futura implementación
                println("Ir a Login")
            }
        )
    }
}




@Composable
fun WelcomeScreen(
    onSignUpClick: () -> Unit,
    onLoginClick: () -> Unit
) {
    // 1. Fondo con Degradado (Brush)
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        SoftPink,       // 0% - Color más claro arriba
                        DeepPurple,     // ~50%
                        DarkBackground, // ~80%
                        Color.Black     // 100% - Fundido a negro abajo
                    )
                )
            )
    ) {
        // 2. Contenido Principal
        Column(
            modifier = Modifier
                .fillMaxSize()
                // statusBarsPadding: Baja el contenido para no chocar con la hora/batería
                .statusBarsPadding()
                // navigationBarsPadding: Sube el contenido para no chocar con la barra de gestos inferior
                .navigationBarsPadding()
                .padding(horizontal = 24.dp, vertical = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            // SpaceBetween empuja el logo arriba y los botones abajo, dejando el texto en medio
            verticalArrangement = Arrangement.SpaceBetween
        ) {

            // --- SECCIÓN SUPERIOR: Logo ---
            LogoSection()

            // --- SECCIÓN MEDIA: Copywriting ---
            MainCopySection()

            // --- SECCIÓN INFERIOR: Acciones ---
            ActionsSection(onSignUpClick, onLoginClick)
        }
    }
}

// --- SUB-COMPONENTES PRIVADOS (Clean UI) ---

@Composable
private fun LogoSection() {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Image(
            // Asegúrate de tener 'logo_black_stroke.png' en commonMain/composeResources/drawable
            painter = painterResource(Res.drawable.logo_black_stroke),
            contentDescription = "Logo AF2",
            modifier = Modifier.size(250.dp)
        )
    }
}

@Composable
private fun MainCopySection() {
    // Tipografía Serif cursiva para dar ese toque elegante
    val alegrayaFamily= getAlegreyaFontFamily()
    val serifStyle = MaterialTheme.typography.headlineMedium.copy(
        fontFamily = alegrayaFamily,
        fontStyle = FontStyle.Italic,
        color = Color.White,
        textAlign = TextAlign.Center
    )




    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = "Tus gustos.", style = serifStyle)
        Spacer(modifier = Modifier.height(8.dp))
        Text(text = "Tus reglas.", style = serifStyle)
        Spacer(modifier = Modifier.height(8.dp))
        Text(text = "Tu espacio.", style = serifStyle)
    }
}

@Composable
private fun ActionsSection(
    onSignUpClick: () -> Unit,
    onLoginClick: () -> Unit
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        // Botón Principal
        Button(
            onClick = onSignUpClick,
            colors = ButtonDefaults.buttonColors(containerColor = ButtonPink),
            shape = RoundedCornerShape(50), // Bordes completamente redondos
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp) // Altura estándar para buen touch target
        ) {
            Text(
                text = "REGÍSTRATE CON TU CORREO",
                color = Color.Black.copy(alpha = 0.8f), // Contraste legible
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Link de Login
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "¿Ya eres miembro?",
                color = Color.White.copy(alpha = 0.8f),
                style = MaterialTheme.typography.bodyMedium
            )
            TextButton(onClick = onLoginClick) {
                Text(
                    text = "Inicia sesión ahora",
                    color = Color.White,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.Bold,
                        textDecoration = TextDecoration.Underline
                    )
                )
            }
        }
    }
}