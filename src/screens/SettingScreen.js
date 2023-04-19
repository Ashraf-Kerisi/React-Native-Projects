import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStyles } from '../AppStyles';

import { db } from '../../config';
import { ref, onChildAdded, update, set, onValue } from 'firebase/database';
import { MultipleSelectList } from 'react-native-dropdown-select-list'

function SettingScreen({ navigation }) {
  const [fullname, setFullname] = useState('');
  const [about,setAbout]=useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
 
  const [successMessage, setSuccessMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  const [userLogedIn, setUserLogedIn] = useState([]);
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userLogedIn')
      jsonValue != null ? setUserLogedIn(JSON.parse(jsonValue)) : null;

      console.log('see here '+jsonValue)
      setFullname(JSON.parse(jsonValue).fullname);
      setPhone(JSON.parse(jsonValue).phone);
      setEmail(JSON.parse(jsonValue).email);
      setAbout(JSON.parse(jsonValue).about)

    } catch (e) {
      // error reading value
    }
  }

  useEffect( async() => {
    await getData()

  }, []);

  const onUpdate = () => {
    const dbRef = ref(db, `users/+${phone}`);

    set(dbRef, {
      fullname: fullname,
      mobile:phone,
      email:email,
      about:about,
      role:role
    })
    setShowMessage(false)
    setSuccessMessage('Your profile is updated successfully!')
    setShowMessage(true)
  };

  return (
   
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, styles.leftTitle]}>My Profile</Text>
        <Text style={styles.label}>Full Name</Text>
        <View style={[styles.InputContainer]}>
          <TextInput
            style={styles.body}
            placeholder="Full Name"
            onChangeText={setFullname}
            value={fullname}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder={phone ? (phone).toString() : 'phone number'}
            onChangeText={setPhone}
            value={phone ? (phone).toString() : 'phone number'}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <Text style={styles.label}>Email</Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="E-mail Address"
            onChangeText={setEmail}
            value={email}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <Text style={styles.label}>About</Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Type a short summary about yourself"
            onChangeText={setAbout}
            value={about}
            multiline
            numberOfLines={3}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={[styles.InputContainer, { borderWidth: 0 }]}>
          <TouchableOpacity
            style={[styles.buttonContainer, { alignSelf: 'flex-start' }]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonContainer, { alignSelf: 'flex-end', marginLeft: 10, marginTop: -40, backgroundColor: AppStyles.color.tint}]}
            onPress={() => onUpdate()}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>

        {
          showMessage ?
            <Text style={{ marginTop: 10, color: 'green', padding: '2%', borderRadius: 5, opacity: 0.5, fontSize: 16 }}>{successMessage}</Text> : undefined
        }
      </ScrollView>
   
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
    marginBottom: 10,
  },
  leftTitle: {
    alignSelf: 'stretch',
    textAlign: 'left',
    marginLeft: 20,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center',
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
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
  label: {
    width: '75%',
    textAlign: 'left',
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: -5
  },
  InputContainer: {
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: AppStyles.color.grey,
    borderRadius: 10
  },
  body: {
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '48%',
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
  },
  buttonText: {
    color: AppStyles.color.white,
  },
  scrollView: {
    marginHorizontal: 20,
    marginBottom:100,
    alignContent:'center',
    height:200
  },
});

export default SettingScreen;
