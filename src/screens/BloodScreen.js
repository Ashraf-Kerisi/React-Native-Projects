import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BloodRequestScreen from './BloodRequestScreen';
import FindBloodScreen from './FindBloodScreen';
import AddBloodScreen from './AddBloodScreen';

const BloodScreen = ({ route, navigation }) => {
    //const navigation = useNavigation();
    //const { userId } = route.params;
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

    return (
        
            userLogedIn.role == 'admin' ?
                <BloodRequestScreen/>: userLogedIn.role == 'seeker' ?
                    <FindBloodScreen /> : userLogedIn.role == 'donor' ?
                        <AddBloodScreen /> : undefined
            
        
    );
};

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        //alignItems: 'center',
        
      },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 100,
        textAlign: 'center',
        fontSize: 32
    },
    text: {
        fontSize: 16,
        color: 'black'
    }
});

export default BloodScreen;
