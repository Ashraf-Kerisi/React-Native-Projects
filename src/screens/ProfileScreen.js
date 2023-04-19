import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStyles } from '../AppStyles';

import { db } from '../../config';
import { ref, onChildAdded, update, set, onValue } from 'firebase/database';
import { MultipleSelectList } from 'react-native-dropdown-select-list'

function ProfileScreen({ navigation }) {
  const [fullname, setFullname] = useState('');
  const [about,setAbout]=useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [price, setPrice] = useState('');

  const [userLogedIn, setUserLogedIn] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [qualifications, setQualifications]=useState('');
  const [institute,setInstitute]=useState('');
  const [subjectName, setSubjectName] = useState('');
  const [selected, setSelected] = useState([]);

  const categories = [
    { key: '1', value: 'IT' },
    { key: '2', value: 'Language' },
    { key: '3', value: 'Math' },
    { key: '4', value: 'Physical Science' },
    { key: '5', value: 'Artificial Intelligence' },
    { key: '6', value: 'English' },
    { key: '7', value: 'Medicale' },
  ]

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userLogedIn')
      jsonValue != null ? setUserLogedIn(JSON.parse(jsonValue)) : null;

      setFullname(JSON.parse(jsonValue).fullname);
      setPhone(JSON.parse(jsonValue).mobile);
      setEmail(JSON.parse(jsonValue).email);

      const dbRef = ref(db, `tutors/${JSON.parse(jsonValue).mobile}`);
      onValue(dbRef, snapshot => {
        if (snapshot.exists()) {
          const jsonString = JSON.stringify(snapshot);
          const jsonObject = JSON.parse(jsonString);


          setSubjectName((Object.keys(jsonObject.subjects).map((key) => [jsonObject.subjects[key]])).toString());
          setAbout(jsonObject.about);
          setPrice(jsonObject.rate);
          setExperience(jsonObject.experience);
          setQualifications(jsonObject.qualifications);
          setInstitute(jsonObject.institute);
          setSelected((Object.keys(jsonObject.categories).map((key) => [jsonObject.categories[key]])).toString())

        } else {
          //do nothing
        }
      });



    } catch (e) {
      // error reading value
    }
  }

  useEffect(async () => {
    await getData()

  }, []);

  const onUpdate = () => {
    const dbRef = ref(db, `tutors/${phone}`);

    set(dbRef, {
      experience: experience,
      rate: price,
      name: fullname,
      mobile:phone,
      email:email,
      about:about,
      qualifications:qualifications,
      institute:institute,
      subjects: subjectName.split(','),
      categories: selected
    })
    setShowMessage(false)
    setSuccessMessage('Your profile is updated successfully!')
    setShowMessage(true)
  };

  return (
   
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, styles.leftTitle]}>Account Details</Text>
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
      <Text style={styles.label}>Qualifications</Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Qualifications"
            onChangeText={setQualifications}
            value={qualifications}
            multiline
            numberOfLines={3}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <Text style={styles.label}>Institute (last attended)</Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Institute"
            onChangeText={setInstitute}
            value={institute}
            multiline
            numberOfLines={3}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <Text style={styles.label}>Subjects</Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Comma Seperated Subject Names Like (Calculus, Algebra, English Grammar etc.)"
            onChangeText={setSubjectName}
            value={subjectName}
            multiline
            numberOfLines={3}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View> 
        <View style={[styles.InputContainer, { borderWidth: 0 }]}>
          <Text style={{ marginBottom: 10, paddingLeft: 10 }}>Categories</Text>
          <Text style={{ marginBottom: 10, paddingLeft: 10 }}>{selected}</Text>
          <MultipleSelectList
            setSelected={(val) => setSelected(val)}
            data={categories}
            onSelect={console.log(selected)}
            save="value"
            placeholder='add category'
            label="Categories"
          />
        </View>
        <Text style={[styles.label, { width: '48%', marginRight: '50%' }]}>Experience</Text>
        <Text style={[styles.label, { width: '48%', marginLeft: '50%', marginTop: -15 }]}>Rate/Hr</Text>
        <View style={[styles.InputContainer, { width: '48%', marginRight: '50%' }]}>
          <TextInput
            style={[styles.body]}
            placeholder="Exp./year"
            onChangeText={setExperience}
            value={experience}
            keyboardType='numeric'
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={[styles.InputContainer, { width: '48%', marginLeft: '50%', marginTop: -50 }]}>
          <TextInput
            style={[styles.body]}
            placeholder="Price/hr"
            onChangeText={setPrice}
            value={price}
            keyboardType='numeric'
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
            disabled={!subjectName}
            style={[styles.buttonContainer, { alignSelf: 'flex-end', marginLeft: 10, marginTop: -40, backgroundColor: subjectName ? AppStyles.color.tint : 'grey' }]}
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

export default ProfileScreen;
