import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStyles } from '../AppStyles';
import { fonts } from '@rneui/base';

const Dashboard = ({ route, navigation }) => {
  //const navigation = useNavigation();
  //const { userId } = route.params;
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
    <View style={styles.container}>
      <View style={[styles.row,{height:200,}]}>
        <View style={[styles.column, {height:'100%',marginBottom:40,}]}>
          <Text style={{fontSize:60}}>👨‍🏫</Text>
          <Text style={{fontWeight:'bold', fontSize:18}}>{userLogedIn.fullname}</Text>
          <Text>{userLogedIn.phone}</Text>
          <Text>{userLogedIn.email}</Text>
          <TouchableOpacity  
          style={[styles.facebookContainer]}
          onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.facebookText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        </View>

        <View style={{width:'100%', padding:10}}>
          <Text style={{fontSize:18, textAlign:'center', opacity:0.4,marginTop:20}}>-----  {userLogedIn.role == 'tutor' ?'Tutor':'Student'} Dashboard -----</Text>
        </View>

      <View style={styles.row}>
        <View style={[styles.column,{backgroundColor:'plum'}]}>
          {userLogedIn.role == 'admin' ?
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Subjects')}>
              <Text style={styles.icon}>📚</Text>
              <Text style={styles.text}>Subjects</Text>
            </TouchableOpacity> : userLogedIn.role == 'tutor' ?
             <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Subjects')}>
             <Text style={styles.icon}>📚</Text>
             <Text style={styles.text}>My Account</Text>
           </TouchableOpacity> : userLogedIn.role == 'student' ?
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tutors')}>
                <Text style={styles.icon}>👥</Text>
                <Text style={styles.text}>Tutors</Text>
              </TouchableOpacity>  : undefined
          }
        </View>
       
        {userLogedIn.role == 'admin' || userLogedIn.role == 'tutor'?
         <View style={[styles.column,{backgroundColor:'lightgreen'}]}>
         <TouchableOpacity style={styles.button} onPress={() => alert('inprogress')}>
           <Text style={styles.icon}>👨‍🎓</Text>
           <Text style={styles.text}>Requests</Text>
         </TouchableOpacity>
       </View>
        : <View style={[styles.column,{backgroundColor:'lightgreen'}]}>
        <TouchableOpacity style={styles.button} onPress={() => alert('inprogress')}>
          <Text style={styles.icon}>📚</Text>
          <Text style={styles.text}>My Courses</Text>
        </TouchableOpacity>
      </View>}

      </View>
      <View style={styles.row}>
      <View style={[styles.column,{backgroundColor:'cornflowerblue'}]}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Notification')}>
            <Text style={styles.icon}>🔔</Text>
            <Text style={styles.text}>Notifications</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.column,{backgroundColor:'yellowgreen'}]}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.icon}>👨‍🏫</Text>
            <Text style={styles.text}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '5%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    //flex: 1,
    flexDirection: 'row',
    height: 100,
    margin: '1%',
    justifyContent: 'center',
  },
  column: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    margin: '3%',
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width:100,
    textAlign:'center',
    fontSize: 32
  },
  text: {
    fontSize: 16,
    color:'black'
  },
  facebookContainer: {
    alignItems: 'center',
    width: '50%',
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 5,
    marginTop: 5,
  },
  facebookText: {
    color: AppStyles.color.white,
  },
});

export default Dashboard;
