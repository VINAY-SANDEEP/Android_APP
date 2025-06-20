// Calculator Mobile App – Jetpack Compose (Kotlin)
// -------------------------------------------------
// Gradle dependencies (module-level):
// implementation "androidx.compose.ui:ui:1.6.4"
// implementation "androidx.compose.material:material:1.6.4"
// implementation "androidx.activity:activity-compose:1.9.0"
// // Optional expression evaluator
// implementation "net.objecthunter:exp4j:0.4.8"
// kotlinCompilerExtensionVersion = "1.6.4"

package com.example.calculator

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import net.objecthunter.exp4j.ExpressionBuilder

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { CalculatorApp() }
    }
}

@Composable
fun CalculatorApp() {
    var input by remember { mutableStateOf("") }
    var result by remember { mutableStateOf("") }

    val darkBg = Color(0xFF121212)
    MaterialTheme(colors = MaterialTheme.colors.copy(background = darkBg)) {
        Surface(modifier = Modifier.fillMaxSize().background(darkBg)) {
            Column(modifier = Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.Bottom) {

                // Display
                Column(modifier = Modifier.fillMaxWidth().padding(bottom = 20.dp)) {
                    Text(text = if (input.isEmpty()) "0" else input, fontSize = 36.sp, color = Color(0xFFE0E0E0), textAlign = TextAlign.End, modifier = Modifier.fillMaxWidth())
                    Text(text = result, fontSize = 28.sp, color = Color(0xFF00FFA6), textAlign = TextAlign.End, modifier = Modifier.fillMaxWidth())
                }

                // Buttons Grid
                val buttons = listOf(
                    listOf("C", "/", "*", "←"),
                    listOf("7", "8", "9", "-"),
                    listOf("4", "5", "6", "+"),
                    listOf("1", "2", "3", "="),
                    listOf("0", ".", "00", "%")
                )

                buttons.forEach { row ->
                    Row(modifier = Modifier.fillMaxWidth().padding(bottom = 15.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                        row.forEach { label ->
                            CalcButton(label = label,
                                modifier = Modifier.weight(1f).padding(horizontal = 6.dp),
                                onClick = {
                                    when (label) {
                                        "C" -> { input = ""; result = "" }
                                        "=" -> {
                                            try {
                                                val res = ExpressionBuilder(input.replace('%', '*').toString()).build().evaluate()
                                                // prevent decimals like 2.0 -> 2
                                                result = if (res % 1.0 == 0.0) res.toLong().toString() else res.toString()
                                            } catch (e: Exception) {
                                                result = "Invalid"
                                            }
                                        }
                                        "←" -> if (input.isNotEmpty()) input = input.dropLast(1)
                                        else -> input += label
                                    }
                                },
                                background = when (label) {
                                    "=" -> Color(0xFF00B894)
                                    "C" -> Color(0xFFD63031)
                                    else -> Color(0xFF1F1F1F)
                                })
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun CalcButton(label: String, onClick: () -> Unit, background: Color, modifier: Modifier = Modifier) {
    Button(
        onClick = onClick,
        modifier = modifier.height(70.dp),
        colors = ButtonDefaults.buttonColors(backgroundColor = background),
        shape = MaterialTheme.shapes.large
    ) {
        Text(text = label, fontSize = 24.sp, color = Color.White, fontWeight = FontWeight.Medium)
    }
}
