import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Linking, View, TouchableOpacity, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { db } from '../../config';
import { ref, onChildAdded, set } from 'firebase/database';

// import Button from 'react-native-button';
import { AppStyles } from '../AppStyles';


function BloodRequestScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);

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
    // Set up listener for new messages
    const bloodDonorRef = ref(db, 'users/');
    onChildAdded(bloodDonorRef, (snapshot) => {
      const message = snapshot.val();
      setNotifications((prevMessages) => [...prevMessages, message]);
    });

    // Clean up listener
    return () => {
      bloodDonorRef.off();
    };
  }, []);


  // const updateData=()=>{
  //   const bloodDonorRef=ref(db,'requests/-NR_lxg570uu24CxYGWG');
  //  update(db,{
  //     city: "skardu",
  //   })
  //   .then(() => console.log('Data updated.'));
  // }

  const renderItem = ({ item,index }) => (
    <View style={[styles.item]}>
      <Text style={[styles.thumbnail,(item.status?styles.dissable:'')]}>🩸</Text>
      <View style={[(item.status?styles.dissable:''),{ width: '60%' }]}>
        <Text style={styles.name}>Need "{item.bloodGroup}" in {item.city}</Text>
        <Text style={styles.address}>{item.description} </Text>
        <Text style={styles.address}>{item.address} | {item.city} </Text>
        {/* <Text style={{width:'100%', fontSize:11, fontWeight:'bold'}}>🕐 2 Days Ago</Text> */}
      </View>
      <View style={{ width: '30%' }}>
        {!item.status&&
        <TouchableOpacity onPress={() => {
          setNotifications(
            notifications.filter(function (el) { return el.mobile != item.mobile; })
          )
          set(ref(db,'notifications/'+item.mobile),item)
          set(ref(db,'requests/'+item.mobile+item.city+item.bloodGroup),{
            "name":item.name,
            "city":item.city,
            "bloodGroup":item.bloodGroup,
            "mobile":item.mobile,
            "address":item.address,
            "description":item.description,
            "status":1
          })
        }
        }>
          <Text style={{ textAlign: 'center', fontSize: 20, color: 'green' }}>✔</Text>
        </TouchableOpacity>
        }
        <TouchableOpacity onPress={() =>{
           setNotifications(
          notifications.filter(function (el) { return el.mobile != item.mobile; })
        )
        set(ref(db,'requests/'+item.mobile+item.city+item.bloodGroup),null)
        }
        }>
          <Text style={{ textAlign: 'center', fontSize: 14, alignSelf: "flex-end", marginTop: -22, color: 'red' }}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {
        notifications.length ?
          (
            <View>
              <Text style={{ marginTop: '5%', }}>{notifications.length} Requests. </Text>
              <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item.mobile}
                style={{ width: '90%', marginBottom: 50 }}
              /></View>) : <Text style={{ marginTop: '5%', }}>nothing to show</Text>
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20,
  },
  leftTitle: {
    alignSelf: 'stretch',
    textAlign: 'left',
    marginLeft: 20,
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.color.white,
  },
  placeholder: {
    color: 'red',
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 15,
    borderStyle: 'solid',
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
  },
  facebookContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  facebookText: {
    color: AppStyles.color.white,
  },
  checkboxContainer: {
    flexDirection: 'row',
    margin: 10
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5
  },
  dissable:{
    opacity:0.4
  },
  itemContact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 30,
    height: 50,
    marginRight: 16,
    fontSize: 28
  },
  name: {
    fontSize: 14,
    color: 'black'
  },
  address: {
    fontSize: 11,
    color: 'black'
  }
});

export default BloodRequestScreen;
