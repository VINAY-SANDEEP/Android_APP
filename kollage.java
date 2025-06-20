// College Companion – Jetpack Compose implementation
// Single–file demo of the main UI flow. In production you would split by feature & layer.
// Required dependencies (build.gradle):
// implementation "androidx.compose.ui:ui:1.6.4"
// implementation "androidx.compose.material:material:1.6.4"
// implementation "androidx.navigation:navigation-compose:2.8.0"
// implementation "io.coil-kt:coil-compose:2.6.0" // for image loading
// kotlinCompilerExtensionVersion = "1.6.4"

package com.example.collegecompanion

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import coil.compose.AsyncImage

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CollegeCompanionApp()
        }
    }
}

/** Navigation destinations */
sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Dashboard : Screen("dashboard")
    object StudentInfo : Screen("studentInfo")
    object Marks : Screen("marks")
    object TimeTable : Screen("timetable")
    object Attendance : Screen("attendance")
    object Fees : Screen("fees")
    object Complaints : Screen("complaints")
    object Backlogs : Screen("backlogs")
    object Certificates : Screen("certificates")
}

/** Sample static data (replace with API/DB layer) */
object SampleData {
    const val Avatar = "https://randomuser.me/api/portraits/men/32.jpg"
    val student = Student(
        name = "John Smith",
        phone = "+1 (555) 123‑4567",
        branch = "Computer Science",
        roll = "CS2021001",
        section = "A",
        avatar = Avatar
    )

    val marks = listOf(
        Mark("Mathematics", "85/100", Icons.Default.Calculate),
        Mark("Physics", "78/100", Icons.Default.Workspaces),
        Mark("Chemistry", "82/100", Icons.Default.Science),
        Mark("Programming", "91/100", Icons.Default.Code),
        Mark("Database", "88/100", Icons.Default.Storage)
    )

    val timetable = listOf(
        DaySchedule("Monday", "Math (9‑10)", "Physics (10‑11)", "Prog Lab (2‑4)"),
        DaySchedule("Tuesday", "Chemistry (9‑10)", "Math (11‑12)", "Electives (3‑5)"),
        DaySchedule("Wednesday", "Physics (9‑10)", "Database (11‑12)", "Seminar (2‑4)"),
        DaySchedule("Thursday", "Programming (9‑10)", "Math (11‑12)", "Lab (2‑4)"),
        DaySchedule("Friday", "Database (9‑10)", "Chemistry (11‑12)", "Project (2‑4)")
    )

    val attendance = Attendance(
        overall = "87%",
        subjects = listOf(
            AttRow("Mathematics", 28, 30, "93%"),
            AttRow("Physics", 25, 30, "83%"),
            AttRow("Chemistry", 24, 30, "80%"),
            AttRow("Programming", 27, 30, "90%"),
            AttRow("Database", 23, 30, "77%")
        )
    )

    val fees = listOf(
        Fee("FEE2023001", "15 Jan 2023", "$1,200", FeeStatus.PAID),
        Fee("FEE2023002", "15 Feb 2023", "$1,200", FeeStatus.PAID),
        Fee("FEE2023003", "15 Mar 2023", "$1,200", FeeStatus.PAID),
        Fee("FEE2023004", "15 Apr 2023", "$1,200", FeeStatus.PENDING),
        Fee("FEE2023005", "15 May 2023", "$1,200", FeeStatus.DUE)
    )

    val complaints = listOf(
        Complaint("COMP2023001", "10 Mar 2023", "Library Book Not Available", "Resolved", "Requested book 'Advanced Algorithms' was not available even though the system showed it as available."),
        Complaint("COMP2023002", "25 Mar 2023", "Classroom AC Not Working", "In Progress", "AC in classroom B‑205 has not been working for 3 days."),
        Complaint("COMP2023003", "05 Apr 2023", "Cafeteria Food Quality", "Pending", "Food quality has deteriorated significantly in the past month.")
    )

    val certificates = listOf(
        Certificate("CERT2022001", "Course Completion Certificate", "15 May 2022", "https://example.com/certs/CERT2022001.pdf"),
        Certificate("CERT2022002", "Sports Participation Certificate", "20 Aug 2022", "https://example.com/certs/CERT2022002.pdf"),
        Certificate("CERT2023001", "Academic Excellence Certificate", "10 Jan 2023", "https://example.com/certs/CERT2023001.pdf"),
        Certificate("CERT2023002", "Workshop Participation – AI Fundamentals", "28 Feb 2023", "https://example.com/certs/CERT2023002.pdf")
    )
}

// Data classes

data class Student(
    val name: String,
    val phone: String,
    val branch: String,
    val roll: String,
    val section: String,
    val avatar: String
)

data class Mark(val subject: String, val marks: String, val icon: androidx.compose.ui.graphics.vector.ImageVector)

data class DaySchedule(val day: String, val morning: String, val afternoon: String, val evening: String)

data class AttRow(val name: String, val attended: Int, val total: Int, val percentage: String)

data class Attendance(val overall: String, val subjects: List<AttRow>)

enum class FeeStatus { PAID, PENDING, DUE }

data class Fee(val id: String, val date: String, val amount: String, val status: FeeStatus)

data class Complaint(val id: String, val date: String, val subject: String, val status: String, val description: String)

data class Certificate(val id: String, val name: String, val issuedOn: String, val link: String)

/** Root composable */
@Composable
fun CollegeCompanionApp() {
    val navController = rememberNavController()
    NavHost(navController, startDestination = Screen.Login.route) {
        composable(Screen.Login.route) { LoginScreen { navController.navigate(Screen.Dashboard.route) } }
        composable(Screen.Dashboard.route) { DashboardScreen(navController) }
        composable(Screen.StudentInfo.route) { StudentInfoScreen() }
        composable(Screen.Marks.route) { MarksScreen() }
        composable(Screen.TimeTable.route) { TimeTableScreen() }
        composable(Screen.Attendance.route) { AttendanceScreen() }
        composable(Screen.Fees.route) { FeesScreen() }
        composable(Screen.Complaints.route) { ComplaintsScreen() }
        composable(Screen.Backlogs.route) { BacklogsScreen() }
        composable(Screen.Certificates.route) { CertificatesScreen() }
    }
}

// ------------ UI BUILDING BLOCKS -----------------
@Composable
fun GradientButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(backgroundColor = Color.Transparent),
        contentPadding = PaddingValues(),
        modifier = modifier
    ) {
        Box(
            modifier = Modifier
                .background(
                    brush = Brush.horizontalGradient(listOf(Color(0xFF4e54c8), Color(0xFF8f94fb))),
                    shape = RoundedCornerShape(50)
                )
                .then(Modifier.padding(vertical = 12.dp, horizontal = 20.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text(text, color = Color.White, fontWeight = FontWeight.SemiBold)
        }
    }
}

// ---------------- SCREENS ------------------------
@Composable
fun LoginScreen(onLogin: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(Color(0xFF000000).copy(alpha = 0.7f), Color(0xFF000000).copy(alpha = 0.5f))
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
            Text("College Companion", fontSize = 32.sp, color = Color.White, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(32.dp))
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(16.dp))
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password") },
                singleLine = true,
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(24.dp))
            GradientButton("LOGIN", onClick = onLogin, modifier = Modifier.fillMaxWidth())
        }
    }
}

@Composable
fun DashboardScreen(navController: androidx.navigation.NavHostController) {
    val buttons = listOf(
        DashBtn(Icons.Default.School, "Student Info", Screen.StudentInfo.route),
        DashBtn(Icons.Default.CheckCircle, "Attendance", Screen.Attendance.route),
        DashBtn(Icons.Default.Receipt, "Fees", Screen.Fees.route),
        DashBtn(Icons.Default.Star, "Marks", Screen.Marks.route),
        DashBtn(Icons.Default.Campaign, "Complaints", Screen.Complaints.route),
        DashBtn(Icons.Default.Warning, "Backlogs", Screen.Backlogs.route),
        DashBtn(Icons.Default.Verified, "Certificates", Screen.Certificates.route),
        DashBtn(Icons.Default.CalendarToday, "Time Table", Screen.TimeTable.route),
    )

    Scaffold(topBar = {
        TopAppBar(title = { Text("Student Dashboard") }, backgroundColor = Color(0xFF4e54c8), contentColor = Color.White)
    }) { padding ->
        LazyVerticalGrid(columns = GridCells.Fixed(2), contentPadding = PaddingValues(16.dp), modifier = Modifier.padding(padding)) {
            items(buttons) { btn ->
                Card(
                    elevation = 8.dp,
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier
                        .padding(8.dp)
                        .fillMaxWidth()
                        .aspectRatio(1f)
                        .clickable { navController.navigate(btn.route) }
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                        Icon(btn.icon, contentDescription = null, tint = Color(0xFF4e54c8), modifier = Modifier.size(40.dp))
                        Spacer(Modifier.height(12.dp))
                        Text(btn.title, color = Color(0xFF4e54c8), textAlign = TextAlign.Center)
                    }
                }
            }
        }
    }
}

data class DashBtn(val icon: androidx.compose.ui.graphics.vector.ImageVector, val title: String, val route: String)

@Composable
fun StudentInfoScreen() {
    val s = SampleData.student
    LazyColumn(contentPadding = PaddingValues(24.dp)) {
        item {
            Card(shape = RoundedCornerShape(16.dp), elevation = 8.dp, modifier = Modifier.fillMaxWidth()) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
                    AsyncImage(model = s.avatar, contentDescription = null, modifier = Modifier.size(120.dp).border(3.dp, Color(0xFF4e54c8), RoundedCornerShape(60)), contentScale = ContentScale.Crop)
                    Spacer(Modifier.height(16.dp))
                    Text(s.name, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(16.dp))
                    InfoRow(Icons.Default.Call, s.phone)
                    InfoRow(Icons.Default.School, s.branch)
                    InfoRow(Icons.Default.Badge, "Roll No: ${s.roll}")
                    InfoRow(Icons.Default.Group, "Section: ${s.section}")
                }
            }
        }
    }
}

@Composable
fun InfoRow(icon: androidx.compose.ui.graphics.vector.ImageVector, text: String) {
    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Icon(icon, null, tint = Color(0xFF4e54c8))
        Spacer(Modifier.width(12.dp))
        Text(text, fontSize = 16.sp)
    }
}

@Composable
fun MarksScreen() {
    val list = SampleData.marks
    Scaffold(topBar = { TopAppBar(title = { Text("Academic Marks") }, backgroundColor = Color(0xFF4e54c8), contentColor = Color.White) }) { padding ->
        LazyColumn(modifier = Modifier.padding(padding)) {
            items(list.size) { idx ->
                val item = list[idx]
                ListItem(icon = { Icon(item.icon, null, tint = Color(0xFF4e54c8)) }, text = { Text(item.subject) }, secondaryText = { Text(item.marks) })
                Divider()
            }
        }
    }
}

@Composable
fun TimeTableScreen() {
    val list = SampleData.timetable
    Scaffold(topBar = { TopAppBar(title = { Text("Weekly Timetable") }, backgroundColor = Color(0xFF4e54c8), contentColor = Color.White) }) { padding ->
        LazyColumn(modifier = Modifier.padding(padding)) {
            items(list.size) { idx ->
                val d = list[idx]
                ListItem(text = { Text(d.day, fontWeight = FontWeight.Bold) }, secondaryText = {
                    Column {
                        Text("Morning: ${d.morning}")
                        Text("Afternoon: ${d.afternoon}")
                        Text("Evening: ${d.evening}")
                    }
                })
                Divider()
            }
        }
    }
}

@Composable
fun AttendanceScreen() {
    val att = SampleData.attendance
    Scaffold(topBar = { TopAppBar(title = { Text("Attendance Overview") }, backgroundColor = Color(0xFF4e54c8), contentColor = Color.White) }) { padding ->
        Column(modifier = Modifier.padding(padding).fillMaxWidth()) {
            Card(backgroundColor = Color(0xFF4e54c8), modifier = Modifier.fillMaxWidth().padding(16.dp)) {
                Text("Overall Attendance: ${att.overall}", color = Color.White, modifier = Modifier.padding(16.dp), textAlign = TextAlign.Center)
            }
            Divider()
            LazyColumn {
                items(att.subjects.size) { idx ->
                    val s = att.subjects[idx]
                    ListItem(text = { Text(s.name) }, secondaryText = { Text("${s.attended}/${s.total} • ${s.percentage}") })
                    Divider()
                }
            }
        }
    }
}

@Composable
fun FeesScreen() {
    val fees = SampleData.fees
    Scaffold(topBar = { TopAppBar(title = { Text("Fees Receipts") }, backgroundColor = Color(0xFF4e54c8), contentColor = Color.White) }) { padding ->
        LazyColumn(modifier = Modifier.padding(padding)) {
            items(fees.size) { idx ->
                val f = fees[idx]
                ListItem(
                    icon = { Icon(Icons.Default.Receipt, null) },
                    text = { Text(f.id) },
                    secondaryText = { Text("${f.date} • ${f.amount}") },
                    trailing = {
                        val color = when (f.status) {
                            FeeStatus.PAID -> Color.Green
                            FeeStatus.PENDING -> Color(0xFFFF9800)
                            FeeStatus.DUE -> Color.Red
                        }
                        Text(f.status.name, color = color)
                    }
                )
                Divider()
            }
        }
    }
}

@Composable
fun ComplaintsScreen() {
    val list = SampleData.complaints
    Scaffold(topBar = { TopAppBar(title = { Text("My Complaints") }, backgroundColor = Color(0xFF4e54c8), contentColor = Color.White) }) { padding ->
        LazyColumn(modifier = Modifier.padding(padding)) {
            items(list.size) { idx ->
                val c = list[idx]
                Card(elevation = 4.dp, shape = RoundedCornerShape(8.dp), modifier = Modifier.padding(8.dp).fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text(c.id, fontSize = 14.sp)
                            val color = when (c.status) {
                                "Resolved" -> Color.Green
                                "In Progress" -> Color(0xFFFF9800)
                                else -> Color.Red
                            }
                            Text(c.status, fontSize = 14.sp, color = color)
                        }
                        Spacer(Modifier.height(8.dp))
                        Text(c.subject, fontWeight = FontWeight.SemiBold)
                        Text(c.date, fontSize = 12.sp, color = Color.Gray)
                        Spacer(Modifier.height(8.dp))
                        Text(c.description)
                    }
                }
            }
        }
    }
}

@Composable
fun BacklogsScreen() {
    val hasBacklogs = false
    val message = if (hasBacklogs) "You have pending subjects!" else "No backlogs – you are up to date with all subjects!"
    Scaffold(topBar = { TopAppBar(title = { Text("Backlog Status") }, backgroundColor = Color(0xFF4e54c8), contentColor = Color.White) }) { padding ->
        Box(modifier = Modifier.padding(padding).fillMaxSize(), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(if (hasBacklogs) Icons.Default.Warning else Icons.Default.CheckCircle, null, tint = if (hasBacklogs) Color.Red else Color.Green, modifier = Modifier.size(60.dp))
                Spacer(Modifier.height(16.dp))
                Text(message, textAlign = TextAlign.Center, fontSize = 18.sp)
            }
        }
    }
}

@Composable
fun CertificatesScreen() {
    val certs = SampleData.certificates
    Scaffold(topBar = { TopAppBar(title = { Text("My Certificates") }, backgroundColor = Color(0xFF4e54c8), contentColor = Color.White) }) { padding ->
        LazyColumn(modifier = Modifier.padding(padding)) {
            items(certs.size) { idx ->
                val cert = certs[idx]
                Card(elevation = 4.dp, shape = RoundedCornerShape(8.dp), modifier = Modifier.padding(8.dp).fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Verified, null, tint = Color(0xFF4e54c8))
                            Spacer(Modifier.width(8.dp))
                            Text(cert.name, fontWeight = FontWeight.SemiBold)
                        }
                        Text("Issued on: ${cert.issuedOn}", fontSize = 12.sp, color = Color.Gray)
                        Spacer(Modifier.height(8.dp))
                        GradientButton("Download Certificate", onClick = { /* TODO open link */ }, modifier = Modifier.fillMaxWidth())
                    }
                }
            }
        }
    }
}
