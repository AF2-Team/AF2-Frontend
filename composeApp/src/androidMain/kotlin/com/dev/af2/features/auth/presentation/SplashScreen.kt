package com.dev.af2.features.auth.presentation

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay
import org.jetbrains.compose.resources.painterResource
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow



// Importación mágica generada por KMP (tu paquete puede variar)
// Si se pone rojo, haz Rebuild Project
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.logo_watercolor
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import com.dev.af2.features.auth.presentation.welcome.WelcomePage

// 1. La clase Screen de Voyager (Maneja la lógica de navegación)
class SplashPage : Screen {
    override val key: ScreenKey = uniqueScreenKey
    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow

        // Llamamos a tu UI pura
        SplashScreen(
            onTimeout = {
                // .replaceAll hace lo mismo que popUpTo inclusive:
                // Borra el historial y pone la nueva pantalla.
                try {
                    // Prueba usar replace en lugar de replaceAll temporalmente
                    navigator.replace(WelcomePage())
                } catch (e: Exception) {
                    println("CRASH VOYAGER: ${e.message}")
                    e.printStackTrace()
                }
            }
        )
    }
}


@Composable
fun SplashScreen(
    onTimeout: () -> Unit
) {
    LaunchedEffect(Unit) {
        delay(2000)
        onTimeout()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White),
        contentAlignment = Alignment.Center
    ) {
        Image(
            // Acceso directo al recurso generado
            painter = painterResource(Res.drawable.logo_watercolor),
            contentDescription = "Logo AF2",
            modifier = Modifier.size(200.dp)
        )
    }
}