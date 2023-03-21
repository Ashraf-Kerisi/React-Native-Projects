/**
 * Blood Bank React Native App
 *
 * @format
 */

import React from 'react';
import {  SafeAreaView,  ScrollView,  StatusBar,  StyleSheet,  Text,  View,  TouchableOpacity,  Image} from 'react-native';

import { AppStyles, AppIcon } from '../AppStyles';

function App({ navigation }){ 

  return (
    <SafeAreaView >
      <StatusBar
       
        backgroundColor={'#5e0001c7'}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[{ height: '100%', backgroundColor:'#5e0001d4' }]}>
        <View style={styles.container}>
          <View style={{ width: '90%', marginBottom: 50, marginTop: 70 }}>
            <Image source={AppIcon.images.logo} />
            <Text style={styles.logoText}>BLOOD DONATE</Text>
          </View>

          <Text style={styles.title}>WELCOME TO BLOOD BANK</Text>
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 150,
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: AppStyles.color.white,
    marginTop: -115,
    textAlign: 'center',
    width: '90%',
    marginRight:-10,
    alignSelf: 'flex-end'
  },
  title: {
    fontSize: AppStyles.fontSize.content,
    fontWeight: 'bold',
    color: AppStyles.color.white,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
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
  signupContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.white,
    borderRadius: AppStyles.borderRadius.main,
    padding: 8,
    borderWidth: 1,
    borderColor: AppStyles.color.tint,
    marginTop: 15,
  },
  signupText: {
    color: AppStyles.color.tint,
  },
  spinner: {
    marginTop: 200,
  },
});

export default App;
