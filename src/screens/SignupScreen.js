'use strict';

import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import {useValidation}  from 'react-native-form-validator';
import { RadioButton } from 'react-native-paper';
import PhoneInput from "react-native-phone-number-input";

import {db} from '../../config';
import {ref,set, onValue} from 'firebase/database';
// import Button from 'react-native-button';
import { AppStyles } from '../AppStyles';


function SignupScreen({ navigation }, props) {
  const [fullname, setFullname] = useState('');
  const [phoneInput, setPhoneInput] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email,setEmail]=useState('');
  const [checked, setChecked] = useState('student');
  const [userExists, setUserExists] = useState(false);
  const [accountCreated,setAccountCreated]=useState(false);

  const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
    useValidation({
      state: { fullname, phoneNumber,email, password, confirmPassword },
    });
  


  const onRegister = async () => {
    if(
    await validate({
      fullname: { required: true },
      password: { required: true },
      phoneNumber:{required:true, minlength: 13, maxlength: 13, },
      email:{required:true,email: true},
      confirmPassword: { required: true, equalPassword: password }
    })
    ){

    //check for already existance of the user
    const dbRef = ref(db,`users/${phoneNumber}`);
   
    onValue(dbRef, snapshot => {
      if (snapshot.exists()) {
        setUserExists(true)
        setAccountCreated(false)
      }else{
        //add new user to firebase
        set(dbRef,{
          fullname:fullname,
          phone:phoneNumber,
          email:email,
          password:password,
          role:checked
        })
        setAccountCreated(true)
        setUserExists(false)
      }
    });
  }else{
    //alert('something went wrong')
  }

  };

  return (
    <View style={styles.container}>
      
      {accountCreated?
      <View style={{width:'80%'}}>
        <Text style={[styles.title, styles.leftTitle,{color:"green"}]}>Account created successfully! </Text>
        <TouchableOpacity
           style={[styles.facebookContainer,{width:'100%', borderWidth:1}]}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.facebookText}> Login </Text>
      </TouchableOpacity>     
      </View>:    
      <View style={[styles.container, {width:'100%'}]}>
      <Text style={[styles.title, styles.leftTitle]}>Create new account</Text>
      <View style={[{ flexDirection: 'row',    alignItems: 'center',    justifyContent: 'center'}]}>
        <RadioButton.Group onValueChange={value => setChecked(value)} value={checked}>
          <View style={styles.radioButton}>
            
            <RadioButton value="student" /><Text style={{color:'black', marginRight:30}}>Student</Text>
         
           
            <RadioButton value="tutor" /><Text style={{color:'black'}}>Tutor</Text>
          </View>
        </RadioButton.Group>
      </View>
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          placeholder="Full Name *"
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
        <PhoneInput
          ref={phoneInput}
          defaultValue={phoneNumber}
          defaultCode="PK"
          layout="first"
          containerStyle={{ width:'100%', height:50,backgroundColor:'transparent'}}
          textContainerStyle={{borderRadius:50}}
          textInputStyle={{height:50,}}
          onChangeText={(text) => {
            setPhoneNumber(text);
          }}
          onChangeFormattedText={(text) => {
            setPhoneNumber(text);
          }}
        
        />
      </View>
      {
        userExists&&
        <Text style={styles.error}>Already exists!</Text>
      }
      {isFieldInError('phoneNumber') &&
        getErrorsInField('phoneNumber').map(errorMessage => (
          <Text style={styles.error}>{errorMessage}</Text>
        ))}
         <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          placeholder="Enter Email *"
          onChangeText={setEmail}
          value={email}
          placeholderTextColor={AppStyles.color.grey}
          underlineColorAndroid="transparent"
        />
      </View>
      {isFieldInError('email') &&
        getErrorsInField('email').map(errorMessage => (
          <Text style={styles.error}>{errorMessage}</Text>
        ))}
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          placeholder="Password *"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
          placeholderTextColor={AppStyles.color.grey}
          underlineColorAndroid="transparent"
        />
      </View>
      {isFieldInError('password') &&
        getErrorsInField('password').map(errorMessage => (
          <Text style={styles.error}>{errorMessage}</Text>
        ))}
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          placeholder="Confirm Password *"
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholderTextColor={AppStyles.color.grey}
          underlineColorAndroid="transparent"
        />
      </View>
      {isFieldInError('confirmPassword') &&
        getErrorsInField('confirmPassword').map(errorMessage => (
          <Text style={styles.error}>{errorMessage}</Text>
        ))}

      <TouchableOpacity
        style={[styles.facebookContainer, { marginTop: 50 }]}
        onPress={() => onRegister()}>
        <Text style={styles.facebookText}>Sign Up</Text>
      </TouchableOpacity>
      </View>
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
  error: {
    color: 'red',
    fontSize: 11
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,

  },
});

export default SignupScreen;
