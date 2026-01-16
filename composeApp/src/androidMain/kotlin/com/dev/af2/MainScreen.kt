package com.dev.af2

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberTopAppBarState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.nestedscroll.nestedScroll
import cafe.adriel.voyager.core.model.rememberScreenModel
import cafe.adriel.voyager.core.screen.Screen
import cafe.adriel.voyager.navigator.tab.CurrentTab
import cafe.adriel.voyager.navigator.tab.TabNavigator

import com.dev.af2.features.auth.presentation.HomeTab
import com.dev.af2.features.auth.presentation.components.CustomTopBar

class MainScreen : Screen {
    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    override fun Content() {
        // 1. Iniciamos el Modelo Principal
        val screenModel = rememberScreenModel { MainScreenModel() }
        val state by screenModel.state.collectAsState()

        // (Opcional) Refrescar usuario cada vez que volvemos a esta pantalla
        LaunchedEffect(Unit) {
            screenModel.getCurrentUser()
        }

        val scrollBehavior = TopAppBarDefaults.enterAlwaysScrollBehavior(rememberTopAppBarState())

        TabNavigator(HomeTab()) { tabNavigator ->
            Scaffold(
                modifier = Modifier.nestedScroll(scrollBehavior.nestedScrollConnection),
                topBar = {
                    CustomTopBar(
                        tabNavigator = tabNavigator,
                        scrollBehavior = scrollBehavior,
                        // 2. ¡AQUÍ ESTÁ LA CLAVE! Pasamos el avatar del usuario cargado
                        userAvatarUrl = state.currentUser?.avatar
                    )
                },
                content = { innerPadding ->
                    Box(
                        modifier = Modifier
                            .padding(innerPadding)
                            .fillMaxSize()
                    ) {
                        CurrentTab()
                    }
                }
            )
        }
    }
}