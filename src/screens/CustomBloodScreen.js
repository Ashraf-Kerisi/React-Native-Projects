import React, {useState,useEffect} from 'react';
import {StyleSheet, Text, TextInput, View, TouchableOpacity} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db} from '../../config';
import {ref,set, onValue} from 'firebase/database';
import { useValidation } from 'react-native-form-validator';

// import Button from 'react-native-button';
import {AppStyles} from '../AppStyles';
import { Alert } from 'react-native';


function CustomBloodScreen({navigation}) {
  const [address, setAddress] = useState('');
  const [description, setDescription]=useState('');
  const [selected, setSelected] = useState("");
  const [selectedCity, setSelectedCity] = React.useState("");
  const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
  useValidation({
    state: { address, description, selected, selectedCity },
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

  
  const [userLogedIn, setUserLogedIn] = useState([]);

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


  const [showRequestStatus,setShowRequestStatus]=useState(null);
  const onRequest = () => {

    if(
      validate({
        selected: { required: true },
        selectedCity: { required: true },
        address: {required:true}
      })
      ){
    set(ref(db,'requests/'+userLogedIn.phone+selectedCity+selected),{
      "name":userLogedIn.fullname,
      "city":selectedCity,
      "bloodGroup":selected,
      "mobile":userLogedIn.phone,
      "address":address,
      "description":description,
      "status":0
    })

    setShowRequestStatus(null);
    setSelected('');
    setAddress("");
    setDescription("");
    if(userLogedIn.role=='seeker'){
      setShowRequestStatus("You request is generated, waiting for admin's approval.")
    }else{
      setShowRequestStatus("Blood request is created succesfully!")

    }
  }else{
    //dddd
  }
    
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.leftTitle]}>Create Blood Request</Text>
      
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
      <View style={styles.InputContainer}>
        <TextInput
          style={[styles.body,{height:70}]}
          placeholder="Address *"         
          onChangeText={setAddress}
          value={address}
          multiline
          numberOfLines={4}
          placeholderTextColor={AppStyles.color.grey}
          underlineColorAndroid="transparent"
        />
      </View>
      {isFieldInError('address') &&
        getErrorsInField('address').map(errorMessage => (
          <Text style={styles.error}>{errorMessage}</Text>
        ))}
      <View style={styles.InputContainer}>
        <TextInput
          style={[styles.body, {height:100}]}
          placeholder="Description"         
          onChangeText={setDescription}
          value={description}
          multiline
          numberOfLines={5}
          placeholderTextColor={AppStyles.color.grey}
          underlineColorAndroid="transparent"
        />
      </View>
      <Text style={{margin:10, color:'green', width:'70%'}}>{showRequestStatus}</Text>
      <TouchableOpacity
        style={[styles.facebookContainer, {marginTop: 10}]}
        onPress={() => onRequest()}>
        <Text style={styles.facebookText}>Create Request</Text>
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

export default CustomBloodScreen;
