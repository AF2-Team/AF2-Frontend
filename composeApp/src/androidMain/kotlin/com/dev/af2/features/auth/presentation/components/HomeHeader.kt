package com.dev.af2.features.auth.presentation.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.jetbrains.compose.resources.painterResource

// Recurso generado
import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.logo_header// ASEGURATE DE TENER ESTA IMAGEN EN RESOURCES

@Composable
fun HomeHeader(
    onInicioClick: () -> Unit,
    onEtiquetasClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(56.dp) // Altura estándar de AppBar
            .background(Color.White)
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // 1. Logo a la izquierda
        // Si no tienes 'logo_header' aún, usa un Box placeholder para que no crashee
        Image(
            painter = painterResource(Res.drawable.logo_header),
            contentDescription = "Logo Header",
            modifier = Modifier
                .height(32.dp) // Ajusta el tamaño según tu logo
                .width(100.dp) // Ajusta proporción
        )

        Spacer(modifier = Modifier.weight(1f)) // Empuja lo siguiente a la derecha

        // 2. Botones de Navegación (Texto)
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = "Inicio",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black,
                modifier = Modifier.clickable { onInicioClick() }
            )

            Spacer(modifier = Modifier.width(20.dp))

            Text(
                text = "Etiquetas",
                fontSize = 16.sp,
                fontWeight = FontWeight.Normal, // Normal para indicar que no está seleccionado
                color = Color.Gray,
                modifier = Modifier.clickable { onEtiquetasClick() }
            )
        }
    }
}