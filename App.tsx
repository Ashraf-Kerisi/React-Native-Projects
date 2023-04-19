import React, { useEffect, useState } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import SubjectsScreen from './src/screens/SubjectsScreen';

//old app
import AddBloodScreen from './src/screens/AddBloodScreen';
import FindBloodScreen from './src/screens/FindBloodScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import CustomBloodScreen from './src/screens/CustomBloodScreen';
import BloodScreen from './src/screens/BloodScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingScreen from './src/screens/SettingScreen';


import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDJi-cMAJ7Eo2qW4athusz-xusyXlWGK6E",
  authDomain: "mytutor-616e6.firebaseapp.com",
  databaseURL: "https://mytutor-616e6-default-rtdb.firebaseio.com/",
  projectId: "mytutor-616e6",
  storageBucket: "mytutor-616e6.appspot.com",
  messagingSenderId: "342072652782",
  appId: "1:342072652782:web:894d88792b2f76ee01d4ff"
};

firebase.initializeApp(firebaseConfig);

import { AppStyles } from './src/AppStyles';
import TutorsScreen from './src/screens/TutorsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MyTabs() {
  const [userLogedIn, setUserLogedIn] = useState({});
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userLogedIn')
      jsonValue != null ? setUserLogedIn(JSON.parse(jsonValue)) : null;
    } catch (e) {
      // error reading value
    }
  }

  useEffect(() => {
    getData()
  }, []);

  return (
    <Tab.Navigator
    initialRouteName="HomeTab"
    backBehavior="history"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
              iconName = focused? 'ios-home-sharp': 'ios-home-outline';
          } else if (route.name === 'Favourites') {
              iconName = focused ? 'ios-heart-sharp' : 'ios-heart-outline';
          }         
          // You can return any component that you like here!
          return <Text>ddd</Text>;
      },
      tabBarActiveTintColor: AppStyles.color.tint,
      tabBarInactiveTintColor: 'gray',
      //Tab bar styles can be added here
      tabBarStyle:{paddingVertical: 5,borderTopLeftRadius:15,borderTopRightRadius:15,backgroundColor:'white',position:'absolute',height:50},
      tabBarLabelStyle:{paddingBottom:3},
      headerShown: false,
      unmountOnBlur:true,
  })}
    >
      <Tab.Screen 
       options={{
        tabBarLabel: (userLogedIn.role=='tutor')?'My Account':'Tutors',
        tabBarIcon: ({ color, size }) => (
          <Text style={{minWidth:'20%'}}>{(userLogedIn.role=='tutor')?'📚':'👥'}</Text>
        ),   
           
      }}
      name={ (userLogedIn.role=='tutor')?'Subjects':'Tutors'} component={(userLogedIn.role=='tutor')?ProfileScreen:TutorsScreen} />
        <Tab.Screen 
       options={{
        tabBarLabel: (userLogedIn.role=='tutor')?'Requests':'Courses',
        tabBarIcon: ({ color, size }) => (
          <Text style={{minWidth:'20%'}}>{(userLogedIn.role=='tutor')?'👨‍🎓':'📚'}</Text>
        ),   
           
      }}
      name={(userLogedIn.role=='tutor')?'Requests':'Courses'} component={SubjectsScreen} />
       <Tab.Screen
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Text style={{minWidth:'20%', fontSize:26, marginTop:-20, borderRadius:50, padding:5, backgroundColor:'white', width:50, textAlign:'center'}}>🏠</Text>
        ),
      }}
       name="HomeTab" component={HomeScreen}/>
      <Tab.Screen 
       options={{
        tabBarLabel: 'Notification',
        tabBarIcon: ({ color, size }) => (
          <Text style={{minWidth:'20%'}}>🔔</Text>
        ),
      }}
      name="Notification" component={NotificationScreen} />
      <Tab.Screen 
       options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Text style={{minWidth:'20%'}}>👤</Text>
        ),
      }}
      name="Profile" component={SettingScreen} />
      <Tab.Screen 
       options={{
        tabBarLabel: 'Add',
        tabBarIcon: ({ color, size }) => (
          <Text style={{minWidth:'20%'}}>➕</Text>
        ),
        tabBarButton: () => null,
      }}
      name="AddBlood" component={AddBloodScreen}  />
      <Tab.Screen 
       options={{
        tabBarLabel: 'Add',
        tabBarIcon: ({ color, size }) => (
          <Text style={{minWidth:'20%'}}>➕</Text>
        ),
        tabBarButton: () => null,
      }}
      name="CustomBloodScreen" component={CustomBloodScreen}  />
      
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PhoneAuth"
        screenOptions={{
          headerTintColor: 'white',
          headerTitleStyle: styles.headerTitleStyle,
          headerStyle: { backgroundColor: AppStyles.color.tint },
        }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen 
         options={({navigation}) => ({
          //headerTitle: (props) => <LogoTitle {...props} />,
          headerRight: ({}) => (
            <TouchableOpacity onPress={() => {
              firebase.auth().signOut()
              AsyncStorage.removeItem('userLogedIn')
              navigation.navigate('Welcome')
            }}>
            <Text style={{fontSize:14, color:'white',fontWeight:'bold'}}>Logout</Text>
            </TouchableOpacity>
          ),
          headerBackVisible:false
        })}
        name="Home" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: 'white',
  },
});

export default App;
