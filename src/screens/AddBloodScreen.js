import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View, TouchableOpacity,Alert,PermissionsAndroid } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { SelectList } from 'react-native-dropdown-select-list'
import Geolocation from '@react-native-community/geolocation';
import { useValidation } from 'react-native-form-validator';

import {db} from '../../config';
import {ref,set, onValue} from 'firebase/database';
// import Button from 'react-native-button';
import {AppStyles} from '../AppStyles';

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted');
      // Call function to enable location here
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}


function AddBloodScreen({navigation}) {
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [position, setPosition] = useState(null);

  const [selected, setSelected] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");
  
  const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
    useValidation({
      state: { fullname, phone, address, selected,selectedCity },
    });


  const data = [
    { key: '1', value: 'A+' },
    { key: '2', value: 'A-' },
    { key: '3', value: 'B+' },
    { key: '4', value: 'B-' },
    { key: '5', value: 'O+' },
    { key: '6', value: 'O-' },
    { key: '7', value: 'AB+' },
    { key: '7', value: 'AB-' },
  ]


  const city_data = [
    { key: '1', value: 'Islamabad' },
    { key: '2', value: 'Karachi' },
    { key: '3', value: 'Lahore' },
    { key: '4', value: 'Karachi' },
    { key: '5', value: 'Quetta' },
    { key: '6', value: 'Abbottabad' },
    { key: '7', value: 'Mansehra' },
    { key: '7', value: 'Rawalpindi' },
    { key: '8', value: 'Faisalabad' },
    { key: '9', value: 'Gilgit' },
    { key: '10', value: 'Skardu' },
    { key: '11', value: 'Hyderabad' },
    { key: '12', value: 'Peshawar' },
    { key: '13', value: 'Gujranwala' },
  ]
  const [showMessage, setShowMessage]=useState(null);
  const onRegister = () => {
   if( validate({
      fullname: { minlength: 3, maxlength: 50, required: true },
      phone: { numbers: true, maxlength:12, required: true },
      selected: {required:true},
      selectedCity: {required:true}
    })){

       //add new user to firebase
       set(ref(db,'donors/'+fullname+'_'+phone+'_'+selected),{
        fullname:fullname,
        mobile:phone,
        address:address,
        bloodGroup:selected,
        city:selectedCity,
        role:"donor",
        status:0,
        location:position
      })

      setShowMessage(`You Blood info added successfully. It will be avaiable after admin's approval`);
    }else{
      //alert('something wend wrong')
    }
  };

  const getCurrentPosition = () => {
    setToggleCheckBox(!toggleCheckBox)
    if(!toggleCheckBox){
      requestLocationPermission();
      Geolocation.getCurrentPosition(
        (pos) => {
          console.log(JSON.stringify(pos))
          setPosition(JSON.stringify(pos));
        },
        (error) => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
        { enableHighAccuracy: true }
      );
    }
  };


  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.leftTitle]}>Add Blood Info</Text>
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          placeholder="Name"
          onChangeText={setFullname}
          value={fullname}
          placeholderTextColor={AppStyles.color.grey}
          underlineColorAndroid="transparent"
        />
      </View>
      {isFieldInError('fullname') &&
        getErrorsInField('fullname').map(errorMessage => (
          <Text style={styles.error}>{errorMessage}</Text>
        ))}
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          placeholder="Number"
          onChangeText={setPhone}
          value={phone}
          placeholderTextColor={AppStyles.color.grey}
          underlineColorAndroid="transparent"
        />
      </View>
      {isFieldInError('phone') &&
        getErrorsInField('phone').map(errorMessage => (
          <Text style={styles.error}>{errorMessage}</Text>
        ))}
      <View style={[styles.InputContainer,{borderWidth:0}]}>
        <SelectList
      setSelected={(val) => setSelected(val)}
      placeholder="Select Blood Group"
      searchPlaceholder="type blood group"
      data={data}
      dropdownTextStyles={{ color: 'black' }}
      inputStyles={{ color: 'black' }}
      save="value"
    />
      </View>
      {isFieldInError('selected') &&
        getErrorsInField('selected').map(errorMessage => (
          <Text style={styles.error}>{errorMessage}</Text>
        ))}
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          placeholder="Address"         
          onChangeText={setAddress}
          value={address}
          placeholderTextColor={AppStyles.color.grey}
          underlineColorAndroid="transparent"
        />
      </View>
      <View style={[styles.InputContainer,{borderWidth:0}]}>
      <SelectList
          setSelected={(val) => setSelectedCity(val)}
          placeholder="Select The City"
          searchPlaceholder="type city name"
          data={city_data}
          dropdownTextStyles={{ color: 'black' }}
          inputStyles={{ color: 'black' }}
          save="value"
        />
      </View>
      {isFieldInError('selectedCity') &&
        getErrorsInField('selectedCity').map(errorMessage => (
          <Text style={styles.error}>{errorMessage}</Text>
        ))}
       <View style={styles.checkboxContainer}>
        <CheckBox
          value={toggleCheckBox}
          onValueChange={getCurrentPosition}
          style={styles.checkbox}
        />
        <Text style={styles.label}>Allow location services.</Text>
      </View>
      {
        showMessage? <Text style={{width:'80%', color:"green"}}>{showMessage}</Text>:undefined
      }
     
      <TouchableOpacity
        style={[styles.facebookContainer, {marginTop: 10}]}
        onPress={() => onRegister()}>
        <Text style={styles.facebookText}>Submit</Text>
      </TouchableOpacity>
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
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
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
    margin:10
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  error: {
    color: 'red',
    fontSize: 11
  },
});

export default AddBloodScreen;
