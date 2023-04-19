import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import PhoneInput from "react-native-phone-number-input";

// import Button from 'react-native-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { db } from '../../config';
import { ref, onValue } from 'firebase/database';


// const firebaseConfig = {
//   apiKey: "AIzaSyDAOqBcBeSkLIEtCQhs7Af-o-Odlaux5oU",
//   authDomain: "mytutor-472dd.firebaseapp.com",
//   databaseURL: "https://mytutor-472dd-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "mytutor-472dd",
//   storageBucket: "mytutor-472dd.appspot.com",
//   messagingSenderId: "512487268953",
//   appId: "1:512487268953:web:5d76944e4aeca69c500748"
// };

// firebase.initializeApp(firebaseConfig);

import { AppStyles } from '../AppStyles';

function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [phoneInput, setPhoneInput] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [verificationId, setVerificationId] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState(null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);

  const [user, setUser] = useState(null);

  const recaptchaVerifier = React.useRef(null);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('userLogedIn', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  const sendVerificationCode = async () => {
    navigation.navigate('Home')
    // try {
    //   const phoneProvider = new firebase.auth.PhoneAuthProvider();
    //   const verificationId = await phoneProvider.verifyPhoneNumber(
    //     phoneNumber,
    //     recaptchaVerifier.current
    //   );
    //   setVerificationId(verificationId);
    //   setVerificationInProgress(true);
    // } catch (err) {
    //   setVerificationError(err);
    //   setVerificationInProgress(false);
    // }
  };

  const verifyCode = async () => {
   
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await firebase.auth().signInWithCredential(credential);
      console.log('Successfully authenticated');
    } catch (err) {
      setVerificationError(err);
    }
  };


  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        const dbRef = ref(db, `users/${user.phoneNumber}`);
        onValue(dbRef, snapshot => {
          if (snapshot.exists()) {
            const jsonString = JSON.stringify(snapshot);
            const jsonObject = JSON.parse(jsonString);
            storeData(jsonObject);
            setUser(jsonObject);
            navigation.navigate('Home')
          } else {
            setUser(null);
            setErrorMessage('invalid user credentials');
            navigation.navigate('Signup')
          }
        });
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <Text style={[styles.title, styles.leftTitle]}>Sign In</Text>
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
          withDarkTheme
          withShadow
          autoFocus
        />
      </View>

      <TouchableOpacity
        style={styles.loginContainer}
        onPress={() => sendVerificationCode()}
        disabled={verificationInProgress}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>

  
      {verificationInProgress && (
        <Text>Sending verification code...</Text>
      )}
      {verificationError && (
        <Text>{`Error: ${verificationError.message}`}</Text>
      )}
      {verificationId && (
        <>
          <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
</View>
          <TouchableOpacity style={styles.loginContainer}  onPress={() => verifyCode()} >
          <Text style={styles.loginText}>Verify Code</Text>
            </TouchableOpacity>
        </>
      )}

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 30 }}
          size="large"
          animating={loading}
          color={AppStyles.color.tint}
        />
      ) : (
        undefined
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  or: {
    color: 'black',
    marginTop: 40,
    marginBottom: 10,
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
    alignItems: 'center',
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
    width: 192,
    backgroundColor: AppStyles.color.facebook,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  facebookText: {
    color: AppStyles.color.white,
  },
  googleContainer: {
    width: 192,
    height: 48,
    marginTop: 30,
  },
  googleText: {
    color: AppStyles.color.white,
  },
  error: {
    color: 'red',
    fontSize: 11
  }
});

export default LoginScreen;
