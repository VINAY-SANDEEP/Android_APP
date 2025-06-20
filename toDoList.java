// Todo List Mobile App – Jetpack Compose (Kotlin)
// ----------------------------------------------
// Required dependencies (build.gradle Module):
// implementation "androidx.compose.ui:ui:1.6.4"
// implementation "androidx.compose.material:material:1.6.4"
// implementation "androidx.activity:activity-compose:1.9.0"
// kotlinCompilerExtensionVersion = "1.6.4"

package com.example.todolist

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.util.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { TodoApp() }
    }
}

// ---------- Data Model ----------

data class TodoItem(val id: String = UUID.randomUUID().toString(), val title: String)

// ---------- UI ----------

@Composable
fun TodoApp() {
    MaterialTheme {
        Surface(color = Color(0xFFE3F2FD), modifier = Modifier.fillMaxSize()) {
            TodoScreen()
        }
    }
}

@Composable
fun TodoScreen() {
    var task by remember { mutableStateOf("") }
    val todos = remember { mutableStateListOf<TodoItem>() }
    val focusManager = LocalFocusManager.current

    Column(modifier = Modifier.fillMaxSize().padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("📋 Todo List", fontSize = 30.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0D47A1), modifier = Modifier.padding(top = 40.dp, bottom = 30.dp))

        // Input Row
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White, shape = MaterialTheme.shapes.medium)
                .padding(horizontal = 10.dp, vertical = 4.dp)
                .shadow(4.dp)
        ) {
            TextField(
                value = task,
                onValueChange = { task = it },
                placeholder = { Text("Add a task") },
                colors = TextFieldDefaults.textFieldColors(backgroundColor = Color.Transparent),
                modifier = Modifier.weight(1f)
            )
            Spacer(Modifier.width(8.dp))
            Button(
                onClick = {
                    if (task.trim().isNotEmpty()) {
                        todos.add(TodoItem(title = task.trim()))
                        task = ""
                        focusManager.clearFocus()
                    }
                },
                colors = ButtonDefaults.buttonColors(backgroundColor = Color(0xFF2196F3))
            ) {
                Text("➕", color = Color.White, fontSize = 20.sp)
            }
        }

        // Task List
        LazyColumn(modifier = Modifier.fillMaxWidth().padding(top = 20.dp)) {
            items(todos, key = { it.id }) { item ->
                TodoRow(item = item, onDelete = { id -> todos.removeAll { it.id == id } })
            }
        }
    }
}

@Composable
fun TodoRow(item: TodoItem, onDelete: (String) -> Unit) {
    Card(
        backgroundColor = Color(0xFFBBDEFB),
        shape = MaterialTheme.shapes.medium,
        elevation = 4.dp,
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 10.dp)
    ) {
        Row(
            modifier = Modifier.padding(15.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(item.title, color = Color(0xFF0D47A1), fontSize = 16.sp, modifier = Modifier.weight(1f))
            IconButton(onClick = { onDelete(item.id) }) {
                Text("❌", color = Color(0xFFE53935), fontSize = 18.sp, textAlign = TextAlign.Center)
            }
        }
    }
}
