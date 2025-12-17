package com.dev.af2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        try {
            setContent {
                App()
            }
        } catch (e: Exception) {
            android.util.Log.e("CRASH_DETECTADO", "El error real es: ", e)
            e.printStackTrace()
        }
    }
}

@Preview
@Composable
fun AppAndroidPreview() {
    App()
}