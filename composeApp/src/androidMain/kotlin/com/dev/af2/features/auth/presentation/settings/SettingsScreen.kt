package com.dev.af2.features.auth.presentation.settings


import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.HelpOutline
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.core.screen.ScreenKey
import cafe.adriel.voyager.core.screen.uniqueScreenKey
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow

// Imports de tu proyecto
import com.dev.af2.core.designsystem.getOpenSansFontFamily
import com.dev.af2.features.auth.presentation.login.LoginPage
import com.dev.af2.features.auth.presentation.settings.changepassword.ChangePasswordPage

// --- COLORES ---
private val ColorBgWhite = Color.White
private val ColorDarkText = Color(0xFF423646)
private val Pink= Color(0xFFBCA1BD)
private val ColorIconGray = Color(0xFF888888)
private val ColorDanger = Color(0xFFEF4444) // Rojo para cerrar sesión

class SettingsPage : Screen {
    override val key: ScreenKey = uniqueScreenKey

    @Composable
    override fun Content() {
        val navigator = LocalNavigator.currentOrThrow
        SettingsScreen(
            onBackClick = { navigator.pop() },
            onLogoutClick = {
                // Limpiar sesión y volver al Login
                navigator.popUntilRoot()
                navigator.push(LoginPage())
            }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onBackClick: () -> Unit,
    onLogoutClick: () -> Unit
) {
    val openSansFamily = getOpenSansFontFamily()
    val navigator = LocalNavigator.currentOrThrow
    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        "Configuración",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontFamily = openSansFamily,
                            fontWeight = FontWeight.Normal,
                            color = Pink
                        )
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Atrás",
                            tint = Pink
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = ColorDarkText)
            )
        },
        containerColor = ColorBgWhite
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // SECCIÓN: CUENTA
            item { SectionHeader("Cuenta") }
            item {
                SettingsItem(
                    icon = Icons.Default.Person,
                    title = "Editar Perfil",
                    onClick = { /* Navegar a editar perfil */ }
                )
            }
            item {
                SettingsItem(
                    icon = Icons.Default.Lock,
                    title = "Cambiar contraseña",
                    onClick = { navigator.push(ChangePasswordPage()) }
                )
            }


            // SECCIÓN: SESIÓN
            item {
                Spacer(modifier = Modifier.height(24.dp))
                // Botón Cerrar Sesión (Estilo diferente)
                Surface(
                    onClick = onLogoutClick,
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFFFFF0F0), // Fondo rojo muy suave
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.Logout,
                            contentDescription = null,
                            tint = ColorDanger,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Cerrar Sesión",
                            style = MaterialTheme.typography.bodyLarge.copy(
                                fontWeight = FontWeight.Bold,
                                color = ColorDanger
                            )
                        )
                    }
                }
            }
        }
    }
}

// --- Componentes Auxiliares ---

@Composable
private fun SectionHeader(title: String) {
    Text(
        text = title,
        style = MaterialTheme.typography.labelLarge.copy(
            fontWeight = FontWeight.Bold,
            color = Color.Gray
        ),
        modifier = Modifier.padding(top = 16.dp, bottom = 8.dp, start = 4.dp)
    )
}

@Composable
private fun SettingsItem(
    icon: ImageVector,
    title: String,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(12.dp),
        color = Color(0xFFF9F9F9), // Gris muy claro
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Icono Izquierdo
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = ColorDarkText,
                modifier = Modifier.size(24.dp)
            )

            Spacer(modifier = Modifier.width(16.dp))

            // Texto
            Text(
                text = title,
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontWeight = FontWeight.Medium,
                    color = ColorDarkText
                ),
                modifier = Modifier.weight(1f)
            )

            // Flecha Derecha
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowForwardIos,
                contentDescription = null,
                tint = ColorIconGray,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}