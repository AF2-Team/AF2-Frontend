package com.dev.af2.core.designsystem
import androidx.compose.ui.unit.sp
import androidx.compose.material3.Typography
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import org.jetbrains.compose.resources.Font

// Imports de tus recursos generados
// IMPORTANTE: Haz "Rebuild Project" si 'Res' sale en rojo tras añadir los .ttf
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.alegreya_variable
import af2.composeapp.generated.resources.alegreya_italic_variable
import af2.composeapp.generated.resources.opensans_italic


// 1. Definimos la Familia de Fuentes
@Composable
fun getAlegreyaFontFamily(): FontFamily {
    return FontFamily(
        Font(resource = Res.font.alegreya_variable, weight = FontWeight.Normal),
        Font(resource = Res.font.alegreya_variable, weight = FontWeight.Bold),
        Font(resource = Res.font.alegreya_italic_variable, weight = FontWeight.Normal, style = FontStyle.Italic)
    )
}
@Composable
fun getOpenSansFontFamily(): FontFamily {
    return FontFamily(
         Font(resource = Res.font.opensans_italic, weight = FontWeight.Normal, style = FontStyle.Italic)
    )
}


// 2. Definimos la Tipografía de Material Design (Opcional, pero recomendado)
// Esto sobreescribe los estilos por defecto (Body, Headline, etc.)
@Composable
fun getAppTypography(): Typography {
    val alegreya = getAlegreyaFontFamily()

    return Typography(
        // Puedes personalizar cada variante aquí
        headlineMedium = androidx.compose.ui.text.TextStyle(
            fontFamily = alegreya,
            fontWeight = FontWeight.Normal,
            fontSize = 28.sp
        ),
        bodyLarge = androidx.compose.ui.text.TextStyle(
            fontFamily = alegreya,
            fontWeight = FontWeight.Normal,
            fontSize = 16.sp
        ),
        titleMedium = androidx.compose.ui.text.TextStyle(
            fontFamily = alegreya,
            fontWeight = FontWeight.Bold,
            fontSize = 18.sp // Un poco más grande para títulos
        )
        // ... define el resto si quieres
    )
}

// Extensiones útiles para unidades si no las tienes importadas
