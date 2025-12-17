package com.dev.af2

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import cafe.adriel.voyager.navigator.CurrentScreen
import cafe.adriel.voyager.navigator.Navigator
import com.dev.af2.features.auth.presentation.SplashPage
import org.jetbrains.compose.ui.tooling.preview.Preview

@Composable
@Preview
fun App() {
    MaterialTheme {
        // Iniciamos con la SplashPage
        Navigator(screen = SplashPage()) { navigator ->

            // --- CAMBIO IMPORTANTE ---
            // Usamos CurrentScreen() en lugar de SlideTransition()
            // Esto elimina la animación que causa el conflicto de ciclo de vida.
            CurrentScreen()
            // -------------------------
        }
    }
}