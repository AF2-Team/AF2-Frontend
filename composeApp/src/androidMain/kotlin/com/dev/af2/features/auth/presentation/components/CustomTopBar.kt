package com.dev.af2.features.auth.presentation.components

import af2.composeapp.generated.resources.Res
import af2.composeapp.generated.resources.image_profile
import af2.composeapp.generated.resources.logo_header
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.TopAppBarScrollBehavior
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import cafe.adriel.voyager.navigator.LocalNavigator
import cafe.adriel.voyager.navigator.currentOrThrow
import cafe.adriel.voyager.navigator.tab.TabNavigator
import coil3.compose.AsyncImage
import org.jetbrains.compose.resources.painterResource

import com.dev.af2.features.auth.presentation.HomeTab
import com.dev.af2.features.auth.presentation.profile.ProfilePage

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomTopBar(
    tabNavigator: TabNavigator,
    scrollBehavior: TopAppBarScrollBehavior,
    userAvatarUrl: String? = null // Recibimos la URL aquí
) {
    val colorTabBackground = Color(0xFF423646)
    val rootNavigator = LocalNavigator.currentOrThrow.parent

    Column {
        TopAppBar(
            title = {
                Image(
                    painter = painterResource(Res.drawable.logo_header),
                    contentDescription = null,
                    modifier = Modifier.size(32.dp)
                )
            },
            actions = {
                // LÓGICA DEL AVATAR
                val modifierAvatar = Modifier
                    .padding(horizontal = 8.dp)
                    .size(32.dp)
                    .clip(CircleShape)
                    .clickable {
                        // Al hacer click vamos al perfil
                        rootNavigator?.push(ProfilePage())
                    }
                    .background(Color.Gray)

                if (userAvatarUrl != null) {
                    AsyncImage(
                        model = userAvatarUrl,
                        contentDescription = "Perfil",
                        modifier = modifierAvatar,
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Image(
                        painter = painterResource(Res.drawable.image_profile),
                        contentDescription = "Perfil",
                        modifier = modifierAvatar,
                        contentScale = ContentScale.Crop,
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = colorTabBackground,
                actionIconContentColor = Color.White
            ),
            scrollBehavior = scrollBehavior
        )
        Row(
            Modifier
                .background(colorTabBackground)
                .fillMaxWidth()
                .padding(bottom = 8.dp),
            horizontalArrangement = Arrangement.Center
        ) {
            CustomTopBarItem(tabNavigator = tabNavigator, tabModel = HomeTab())
            Spacer(Modifier.width(16.dp))
            // Aquí irían tus otros tabs
        }
    }
}