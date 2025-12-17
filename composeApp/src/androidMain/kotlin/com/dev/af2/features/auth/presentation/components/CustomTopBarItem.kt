package com.dev.af2.features.auth.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import cafe.adriel.voyager.navigator.tab.Tab
import cafe.adriel.voyager.navigator.tab.TabNavigator

@Composable
fun CustomTopBarItem(tabNavigator: TabNavigator, tabModel: Tab){

    val color = if (tabNavigator.current.key == tabModel.key)
        Color.White
    else Color.White.copy(alpha = 0.6f)

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clip(CircleShape).clickable{
            tabNavigator.current = tabModel
        }
    ) {
        Text(tabModel.options.title, color = color)
        Box(modifier = Modifier.width(16.dp).height(3.dp).clip(CircleShape).background(color))
    }
}