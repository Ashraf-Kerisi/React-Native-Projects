import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import { AppStyles } from './src/AppStyles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BloodScreen() {
  return (<View style={{margin:10}}><Text>I am Blood Screen</Text></View>);
}

function ChatScreen() {
  return (<View style={{margin:10}}><Text>I am Chat Screen</Text></View>);
}

function NotificationScreen() {
  return (<View style={{margin:10}}><Text>I am Notification Screen</Text></View>);
}

function ProfileScreen() {
  return (<View style={{margin:10}}><Text>I am Profile Screen</Text></View>);
}

function MyTabs() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
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
  })}
    >
      <Tab.Screen
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Text style={{minWidth:'20%'}}>🏠</Text>
        ),
      }}
       name="Home" component={HomeScreen} />
      <Tab.Screen 
       options={{
        tabBarLabel: 'Blood',
        tabBarIcon: ({ color, size }) => (
          <Text style={{minWidth:'20%'}}>🩸</Text>
        ),
      }}
      name="Blood" component={BloodScreen} />
      <Tab.Screen 
       options={{
        tabBarLabel: 'Chat',
        tabBarIcon: ({ color, size }) => (
          <Text style={{minWidth:'20%'}}>🧾</Text>
        ),
      }}
      name="Chat" component={ChatScreen} />
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
      name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerTintColor: 'white',
          headerTitleStyle: styles.headerTitleStyle,
          headerMode: 'screen',
          headerStyle: { backgroundColor: AppStyles.color.tint },
         
        }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen 
         options={{
          //headerTitle: (props) => <LogoTitle {...props} />,
          headerRight: () => (
            <Text style={{fontSize:28, color:'white'}}>⚙</Text>
          ),
        }}
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
