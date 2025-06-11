import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  StyleSheet, 
  Animated, 
  ScrollView,
  Image,
  FlatList,
  SafeAreaView,
  Dimensions,
  Linking
} from 'react-native';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screen dimensions
const { width, height } = Dimensions.get('window');

// Online images
const BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const AVATAR_IMAGE = 'https://randomuser.me/api/portraits/men/32.jpg';

// Placeholder data
const PRIMARY_COLOR = '#2563eb';     // Blue-600
const PRIMARY_GRADIENT = ['#2563eb', '#1d4ed8'];
const TEXT_COLOR = '#1f2937';        // Gray-800
const SUBTEXT_COLOR = '#6b7280';     
const BG_LIGHT = '#f9fafb';          
const WHITE = '#ffffff';
const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 8,
};


const studentData = {
  name: 'John Smith',
  phone: '+1 (555) 123-4567',
  branch: 'Computer Science',
  rollNumber: 'CS2021001',
  section: 'A',
  avatar: AVATAR_IMAGE
};

const marksData = [
  { subject: 'Mathematics', marks: '85/100', icon: 'calculator' },
  { subject: 'Physics', marks: '78/100', icon: 'atom' },
  { subject: 'Chemistry', marks: '82/100', icon: 'flask' },
  { subject: 'Programming', marks: '91/100', icon: 'code' },
  { subject: 'Database', marks: '88/100', icon: 'database' },
];

const timetableData = [
  { day: 'Monday', subject1: 'Math (9-10)', subject2: 'Physics (10-11)', subject3: 'Programming Lab (2-4)' },
  { day: 'Tuesday', subject1: 'Chemistry (9-10)', subject2: 'Math (11-12)', subject3: 'Electives (3-5)' },
  { day: 'Wednesday', subject1: 'Physics (9-10)', subject2: 'Database (11-12)', subject3: 'Seminar (2-4)' },
  { day: 'Thursday', subject1: 'Programming (9-10)', subject2: 'Math (11-12)', subject3: 'Lab (2-4)' },
  { day: 'Friday', subject1: 'Database (9-10)', subject2: 'Chemistry (11-12)', subject3: 'Project (2-4)' },
];

// Attendance Data
const attendanceData = {
  overallPercentage: '87%',
  subjects: [
    { name: 'Mathematics', attended: 28, total: 30, percentage: '93%' },
    { name: 'Physics', attended: 25, total: 30, percentage: '83%' },
    { name: 'Chemistry', attended: 24, total: 30, percentage: '80%' },
    { name: 'Programming', attended: 27, total: 30, percentage: '90%' },
    { name: 'Database', attended: 23, total: 30, percentage: '77%' },
  ],
};

// Fees Receipts Data
const feesReceiptsData = [
  { id: 'FEE2023001', date: '15 Jan 2023', amount: '$1,200', status: 'Paid' },
  { id: 'FEE2023002', date: '15 Feb 2023', amount: '$1,200', status: 'Paid' },
  { id: 'FEE2023003', date: '15 Mar 2023', amount: '$1,200', status: 'Paid' },
  { id: 'FEE2023004', date: '15 Apr 2023', amount: '$1,200', status: 'Pending' },
  { id: 'FEE2023005', date: '15 May 2023', amount: '$1,200', status: 'Due' },
];

// Complaints Data
const complaintsData = [
  { 
    id: 'COMP2023001', 
    date: '10 Mar 2023', 
    subject: 'Library Book Not Available', 
    status: 'Resolved',
    description: 'Requested book "Advanced Algorithms" was not available in the library despite the system showing it as available.'
  },
  { 
    id: 'COMP2023002', 
    date: '25 Mar 2023', 
    subject: 'Classroom AC Not Working', 
    status: 'In Progress',
    description: 'AC in classroom B-205 has not been working for the past 3 days, making it difficult to concentrate.'
  },
  { 
    id: 'COMP2023003', 
    date: '05 Apr 2023', 
    subject: 'Cafeteria Food Quality', 
    status: 'Pending',
    description: 'The food quality in the cafeteria has deteriorated significantly in the past month.'
  },
];

// Backlogs Data
const backlogsData = {
  hasBacklogs: false,
  message: 'No backlogs - You are up to date with all subjects!',
  subjects: [],
};

// Certificates Data
const certificatesData = [
  { 
    id: 'CERT2022001', 
    name: 'Course Completion Certificate', 
    issuedOn: '15 May 2022', 
    downloadLink: 'https://example.com/certs/CERT2022001.pdf'
  },
  { 
    id: 'CERT2022002', 
    name: 'Sports Participation Certificate', 
    issuedOn: '20 Aug 2022', 
    downloadLink: 'https://example.com/certs/CERT2022002.pdf'
  },
  { 
    id: 'CERT2023001', 
    name: 'Academic Excellence Certificate', 
    issuedOn: '10 Jan 2023', 
    downloadLink: 'https://example.com/certs/CERT2023001.pdf'
  },
  { 
    id: 'CERT2023002', 
    name: 'Workshop Participation - AI Fundamentals', 
    issuedOn: '28 Feb 2023', 
    downloadLink: 'https://example.com/certs/CERT2023002.pdf'
  },
];

const dashboardButtons = [
  { id: 1, title: 'Student Information', icon: 'graduation-cap', component: 'StudentInfo', iconSet: FontAwesome },
  { id: 2, title: 'Attendance', icon: 'clipboard-check', component: 'Attendance', iconSet: MaterialIcons },
  { id: 3, title: 'Fees Receipts', icon: 'receipt', component: 'FeesReceipts', iconSet: MaterialIcons },
  { id: 4, title: 'Marks', icon: 'star', component: 'Marks', iconSet: FontAwesome },
  { id: 5, title: 'Complaints', icon: 'megaphone', component: 'Complaints', iconSet: Ionicons },
  { id: 6, title: 'Backlogs', icon: 'warning', component: 'Backlogs', iconSet: FontAwesome },
  { id: 7, title: 'Certificates', icon: 'certificate', component: 'Certificates', iconSet: FontAwesome },
  { id: 8, title: 'Time Table', icon: 'calendar', component: 'TimeTable', iconSet: FontAwesome },
];

// Login Screen Component
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Poppins-Regular': { uri: 'https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrJJfecg.woff2' },
        'Poppins-Bold': { uri: 'https://fonts.gstatic.com/s/poppins/v15/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2' },
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = () => {
    navigation.navigate('Dashboard');
  };

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
  }

  return (
    <ImageBackground source={{ uri: BACKGROUND_IMAGE }} style={styles.backgroundImage}>
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
        style={styles.gradientOverlay}
      >
        <View style={styles.container}>
          <Text style={[styles.title, { fontFamily: 'Poppins-Bold' }]}>College Companion</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { fontFamily: 'Poppins-Regular' }]}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, { fontFamily: 'Poppins-Regular' }]}
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity
              style={styles.loginButton}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleLogin}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#4e54c8', '#8f94fb']}
                style={styles.buttonGradient}
              >
                <Text style={[styles.buttonText, { fontFamily: 'Poppins-SemiBold' }]}>LOGIN</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

// Dashboard Screen Component
const DashboardScreen = ({ navigation }) => {
  const [scaleValues] = useState(dashboardButtons.map(() => new Animated.Value(1)));

  const handlePressIn = (index) => {
    Animated.spring(scaleValues[index], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(scaleValues[index], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const renderItem = ({ item, index }) => {
    const IconComponent = item.iconSet;
    return (
      <Animated.View style={{ transform: [{ scale: scaleValues[index] }] }}>
        <TouchableOpacity
          style={styles.dashboardButton}
          onPressIn={() => handlePressIn(index)}
          onPressOut={() => handlePressOut(index)}
          onPress={() => navigation.navigate(item.component)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#a8edea', '#fed6e3']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <IconComponent name={item.icon} size={32} color="#4e54c8" />
            <Text style={[styles.dashboardButtonText, { fontFamily: 'Poppins-Regular' }]}>{item.title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.dashboardContainer}>
      <Text style={[styles.dashboardTitle, { fontFamily: 'Poppins-Bold' }]}>Student Dashboard</Text>
      <FlatList
        data={dashboardButtons}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.dashboardGrid}
      />
    </SafeAreaView>
  );
};

// Student Info Screen Component
const StudentInfoScreen = () => {
  return (
    <ScrollView style={styles.infoContainer}>
      <View style={styles.profileCard}>
        <Image source={{ uri: studentData.avatar }} style={styles.avatar} />
        <Text style={[styles.profileName, { fontFamily: 'Poppins-Bold' }]}>{studentData.name}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="call" size={24} color="#4e54c8" />
          <Text style={[styles.infoText, { fontFamily: 'Poppins-Regular' }]}>{studentData.phone}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MaterialIcons name="school" size={24} color="#4e54c8" />
          <Text style={[styles.infoText, { fontFamily: 'Poppins-Regular' }]}>{studentData.branch}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <FontAwesome name="id-card" size={24} color="#4e54c8" />
          <Text style={[styles.infoText, { fontFamily: 'Poppins-Regular' }]}>Roll No: {studentData.rollNumber}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="people" size={24} color="#4e54c8" />
          <Text style={[styles.infoText, { fontFamily: 'Poppins-Regular' }]}>Section: {studentData.section}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Marks Screen Component
const MarksScreen = () => {
  return (
    <View style={styles.tableContainer}>
      <Text style={[styles.tableTitle, { fontFamily: 'Poppins-Bold' }]}>Academic Marks</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, { fontFamily: 'Poppins-SemiBold' }]}>Subject</Text>
        <Text style={[styles.headerText, { fontFamily: 'Poppins-SemiBold' }]}>Marks</Text>
      </View>
      {marksData.map((item, index) => (
        <View 
          key={index} 
          style={[
            styles.tableRow, 
            index % 2 === 0 ? styles.evenRow : styles.oddRow
          ]}
        >
          <View style={styles.subjectCell}>
            <FontAwesome name={item.icon} size={20} color="#4e54c8" />
            <Text style={[styles.cellText, { fontFamily: 'Poppins-Regular' }]}>{item.subject}</Text>
          </View>
          <Text style={[styles.cellText, { fontFamily: 'Poppins-Regular' }]}>{item.marks}</Text>
        </View>
      ))}
    </View>
  );
};

// Timetable Screen Component
const TimeTableScreen = () => {
  return (
    <View style={styles.timetableContainer}>
      <Text style={[styles.tableTitle, { fontFamily: 'Poppins-Bold' }]}>Weekly Timetable</Text>
      <View style={styles.timetableHeader}>
        <Text style={[styles.headerText, { fontFamily: 'Poppins-SemiBold' }]}>Day</Text>
        <Text style={[styles.headerText, { fontFamily: 'Poppins-SemiBold' }]}>Morning</Text>
        <Text style={[styles.headerText, { fontFamily: 'Poppins-SemiBold' }]}>Afternoon</Text>
      </View>
      {timetableData.map((item, index) => (
        <View 
          key={index} 
          style={[
            styles.timetableRow, 
            index % 2 === 0 ? styles.evenRow : styles.oddRow
          ]}
        >
          <Text style={[styles.cellText, { fontFamily: 'Poppins-SemiBold' }]}>{item.day}</Text>
          <Text style={[styles.cellText, { fontFamily: 'Poppins-Regular' }]}>{item.subject1}</Text>
          <Text style={[styles.cellText, { fontFamily: 'Poppins-Regular' }]}>{item.subject3}</Text>
        </View>
      ))}
    </View>
  );
};

// Attendance Screen Component
const AttendanceScreen = () => {
  return (
    <View style={styles.tableContainer}>
      <Text style={[styles.tableTitle, { fontFamily: 'Poppins-Bold' }]}>
        Attendance Overview
      </Text>
      
      <View style={styles.attendanceSummary}>
        <Text style={[styles.summaryText, { fontFamily: 'Poppins-SemiBold' }]}>
          Overall Attendance: {attendanceData.overallPercentage}
        </Text>
      </View>
      
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, { fontFamily: 'Poppins-SemiBold' }]}>Subject</Text>
        <Text style={[styles.headerText, { fontFamily: 'Poppins-SemiBold' }]}>Attended</Text>
        <Text style={[styles.headerText, { fontFamily: 'Poppins-SemiBold' }]}>Percentage</Text>
      </View>
      
      {attendanceData.subjects.map((subject, index) => (
        <View 
          key={index} 
          style={[
            styles.tableRow, 
            index % 2 === 0 ? styles.evenRow : styles.oddRow
          ]}
        >
          <Text style={[styles.cellText, { fontFamily: 'Poppins-Regular' }]}>{subject.name}</Text>
          <Text style={[styles.cellText, { fontFamily: 'Poppins-Regular' }]}>
            {subject.attended}/{subject.total}
          </Text>
          <Text style={[styles.cellText, { fontFamily: 'Poppins-Regular' }]}>{subject.percentage}</Text>
        </View>
      ))}
    </View>
  );
};

// Fees Receipts Screen Component
const FeesReceiptsScreen = () => {
  return (
    <View style={styles.tableContainer}>
      <Text style={[styles.tableTitle, { fontFamily: 'Poppins-Bold' }]}>
        Fees Receipts
      </Text>
      
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, { fontFamily: 'Poppins-SemiBold' }]}>Receipt ID</Text>
        <Text style={[styles.headerText, { fontFamily: 'Poppins-SemiBold' }]}>Date</Text>
        <Text style={[styles.headerText, { fontFamily: 'Poppins-SemiBold' }]}>Amount</Text>
        <Text style={[styles.headerText, { fontFamily: 'Poppins-SemiBold' }]}>Status</Text>
      </View>
      
      {feesReceiptsData.map((receipt, index) => (
        <View 
          key={index} 
          style={[
            styles.tableRow, 
            index % 2 === 0 ? styles.evenRow : styles.oddRow
          ]}
        >
          <Text style={[styles.cellText, { fontFamily: 'Poppins-Regular' }]}>{receipt.id}</Text>
          <Text style={[styles.cellText, { fontFamily: 'Poppins-Regular' }]}>{receipt.date}</Text>
          <Text style={[styles.cellText, { fontFamily: 'Poppins-Regular' }]}>{receipt.amount}</Text>
          <Text style={[
            styles.cellText, 
            { 
              fontFamily: 'Poppins-Regular',
              color: receipt.status === 'Paid' ? 'green' : receipt.status === 'Pending' ? 'orange' : 'red'
            }
          ]}>
            {receipt.status}
          </Text>
        </View>
      ))}
    </View>
  );
};

// Complaints Screen Component
const ComplaintsScreen = () => {
  return (
    <View style={styles.complaintsContainer}>
      <Text style={[styles.tableTitle, { fontFamily: 'Poppins-Bold' }]}>
        My Complaints
      </Text>
      
      {complaintsData.map((complaint, index) => (
        <View key={index} style={styles.complaintCard}>
          <View style={styles.complaintHeader}>
            <Text style={[styles.complaintId, { fontFamily: 'Poppins-Regular' }]}>{complaint.id}</Text>
            <Text style={[
              styles.complaintStatus,
              { 
                fontFamily: 'Poppins-SemiBold',
                color: complaint.status === 'Resolved' ? 'green' : 
                       complaint.status === 'In Progress' ? 'orange' : 'red'
              }
            ]}>
              {complaint.status}
            </Text>
          </View>
          <Text style={[styles.complaintSubject, { fontFamily: 'Poppins-SemiBold' }]}>
            {complaint.subject}
          </Text>
          <Text style={[styles.complaintDate, { fontFamily: 'Poppins-Regular' }]}>
            {complaint.date}
          </Text>
          <Text style={[styles.complaintDescription, { fontFamily: 'Poppins-Regular' }]}>
            {complaint.description}
          </Text>
        </View>
      ))}
      
      <TouchableOpacity style={styles.newComplaintButton}>
        <Text style={[styles.newComplaintText, { fontFamily: 'Poppins-SemiBold' }]}>
          + New Complaint
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Backlogs Screen Component
const BacklogsScreen = () => {
  return (
    <View style={styles.backlogsContainer}>
      <Text style={[styles.tableTitle, { fontFamily: 'Poppins-Bold' }]}>
        Backlog Status
      </Text>
      
      <View style={styles.backlogCard}>
        <MaterialCommunityIcons 
          name={backlogsData.hasBacklogs ? "alert-circle" : "check-circle"} 
          size={60} 
          color={backlogsData.hasBacklogs ? "red" : "green"} 
        />
        <Text style={[styles.backlogMessage, { fontFamily: 'Poppins-SemiBold' }]}>
          {backlogsData.message}
        </Text>
        
        {backlogsData.hasBacklogs && (
          <View style={styles.backlogSubjects}>
            <Text style={[styles.backlogSubjectsTitle, { fontFamily: 'Poppins-Regular' }]}>
              Subjects with Backlogs:
            </Text>
            {backlogsData.subjects.map((subject, index) => (
              <Text key={index} style={[styles.backlogSubject, { fontFamily: 'Poppins-Regular' }]}>
                - {subject}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

// Certificates Screen Component
const CertificatesScreen = () => {
  const handleDownload = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.certificatesContainer}>
      <Text style={[styles.tableTitle, { fontFamily: 'Poppins-Bold' }]}>
        My Certificates
      </Text>
      
      {certificatesData.map((certificate, index) => (
        <View key={index} style={styles.certificateCard}>
          <View style={styles.certificateHeader}>
            <FontAwesome name="certificate" size={24} color="#4e54c8" />
            <Text style={[styles.certificateName, { fontFamily: 'Poppins-SemiBold' }]}>
              {certificate.name}
            </Text>
          </View>
          <Text style={[styles.certificateDate, { fontFamily: 'Poppins-Regular' }]}>
            Issued on: {certificate.issuedOn}
          </Text>
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={() => handleDownload(certificate.downloadLink)}
          >
            <Text style={[styles.downloadText, { fontFamily: 'Poppins-SemiBold' }]}>
              Download Certificate
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

// Main App Component
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="StudentInfo" component={StudentInfoScreen} />
        <Stack.Screen name="Marks" component={MarksScreen} />
        <Stack.Screen name="TimeTable" component={TimeTableScreen} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
        <Stack.Screen name="FeesReceipts" component={FeesReceiptsScreen} />
        <Stack.Screen name="Complaints" component={ComplaintsScreen} />
        <Stack.Screen name="Backlogs" component={BacklogsScreen} />
        <Stack.Screen name="Certificates" component={CertificatesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradientOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  dashboardTitle: {
    fontSize: 24,
    color: '#4e54c8',
    textAlign: 'center',
    marginVertical: 20,
  },
  dashboardGrid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  dashboardButton: {
    flex: 1,
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    aspectRatio: 1,
    maxWidth: width * 0.45,
  },
  dashboardButtonText: {
    marginTop: 10,
    fontSize: 14,
    color: '#4e54c8',
    textAlign: 'center',
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#4e54c8',
  },
  profileName: {
    fontSize: 22,
    color: '#333',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 15,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  tableTitle: {
    fontSize: 22,
    color: '#4e54c8',
    marginBottom: 20,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4e54c8',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  evenRow: {
    backgroundColor: 'white',
  },
  oddRow: {
    backgroundColor: '#f9f9f9',
  },
  subjectCell: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cellText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    flex: 1,
    textAlign: 'center',
  },
  timetableContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  timetableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4e54c8',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  timetableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  attendanceSummary: {
    backgroundColor: '#4e54c8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  summaryText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  complaintsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  complaintCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  complaintId: {
    fontSize: 14,
    color: '#666',
  },
  complaintStatus: {
    fontSize: 14,
  },
  complaintSubject: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  complaintDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  complaintDescription: {
    fontSize: 14,
    color: '#555',
  },
  newComplaintButton: {
    backgroundColor: '#4e54c8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  newComplaintText: {
    color: 'white',
    fontSize: 16,
  },
  backlogsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  backlogCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backlogMessage: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  backlogSubjects: {
    width: '100%',
    marginTop: 20,
  },
  backlogSubjectsTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  backlogSubject: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginBottom: 5,
  },
  certificatesContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  certificateCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  certificateName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  certificateDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  downloadButton: {
    backgroundColor: '#4e54c8',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  downloadText: {
    color: 'white',
    fontSize: 14,
  },
});

export default App;
