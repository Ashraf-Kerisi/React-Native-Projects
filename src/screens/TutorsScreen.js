import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Modal, View, TouchableOpacity, FlatList, TextInput, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { db } from '../../config';
import { ref, onChildAdded, set } from 'firebase/database';

// import Button from 'react-native-button';
import { AppStyles } from '../AppStyles';


function BloodRequestScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [tutors, setTutors] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [contactDetails,setContactDetails]=useState({})

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
    const bloodDonorRef = ref(db, 'tutors/');
    onChildAdded(bloodDonorRef, (snapshot) => {
      const message = snapshot.val();
      setTutors((prevMessages) => [...prevMessages, message]);
      setMasterDataSource((prevMessages) => [...prevMessages, message]);
    });

    // Clean up listener
    return () => {
      bloodDonorRef.off();
    };
  }, []);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update tutors
      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();

            const itemData2 = item.about
            ? item.about.toUpperCase()
            : ''.toUpperCase();

            const itemData3=item.subjects.join(', ');  // 'A, B, C'

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1 
          || itemData2.indexOf(textData) > -1
          || itemData3.toUpperCase().indexOf(textData)>-1;
        });
      setTutors(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update tutors with masterDataSource
      setTutors(masterDataSource);
      setSearch(text);
    }
  };

  function subjectsView(subjects) {
    return subjects.map((item, index) => <Text style={{ color: 'lightskyblue' }} key={index}>{index > 0 ? ', ' : ''} {item} </Text>);
  }

  const renderItem = ({ item, index }) => (
    <View style={[styles.item]}>
      <Text style={[styles.thumbnail, (item.status ? styles.dissable : '')]}>👨‍🏫</Text>
      <View style={[(item.status ? styles.dissable : ''), { width: '65%' }]}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.address}>{item.about} </Text>
        <Text style={styles.books}>{subjectsView(item.subjects)} </Text>
        {/* <Text style={{width:'100%', fontSize:11, fontWeight:'bold'}}>🕐 2 Days Ago</Text> */}
      </View>
      <View style={{ width: '20%', alignContent: 'flex-end' }}>
        {!item.status &&
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              setContactDetails(item)
              setModalVisible(true)
            }}>
            <Text style={styles.buttonText}>Contact</Text>
          </TouchableOpacity>

        }
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 20, paddingHorizontal: 15, width: '100%' }}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search Subjects Here"
        />
        <FlatList
          data={tutors}
          renderItem={renderItem}
          keyExtractor={(item) => item.mobile}
          style={{ width: '100%', marginBottom: 50 }}
        /></View>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ marginBottom: 10, fontWeight:'bold', textDecorationLine:'underline' }}>Contact Details</Text>
            <Text style={{alignSelf:'center'}}>{contactDetails.name}</Text>
            <Text style={{alignSelf:'center'}}>{contactDetails.about}</Text>
            <Text style={{alignSelf:'center'}}>_______________</Text>
            <View style={{ width: '90%', margin: 10, alignSelf: 'center' }}>
              <View style={{alignSelf:'center'}}>
                <Text style={{alignSelf:'center'}}>email at: {contactDetails.email}</Text>
                <Text style={{alignSelf:'center'}}>- OR -</Text>
                <View style={styles.itemContact}>
                  <TouchableOpacity style={{alignSelf:'center'}}>
                    <Text onPress={() => { Linking.openURL(`sms:${contactDetails.mobile}`); }} style={{ fontSize: 28, marginRight: 10, color: 'black' }}>✉</Text>
                  </TouchableOpacity>
                  <TouchableOpacity >
                    <Text onPress={() => { Linking.openURL(`tel:${contactDetails.mobile}`); }} style={{ fontSize: 14, marginBottom: -8, color: 'black' }}>📞</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.buttonContainer, { alignSelf: 'center' }]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={[styles.buttonText, { padding: 2, paddingHorizontal: 15, fontSize: 11 }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  modalView: {
    margin: 20,
    marginTop: '40%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '3%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  dissable: {
    opacity: 0.4
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
    color: 'gray'
  },
  books: {
    fontSize: 12,
  },
  itemContact: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'center',
    margin:'1%',
    marginBottom:20
  },
  buttonContainer: {
    alignItems: 'center',
    //width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 5,
  },
  buttonText: {
    color: AppStyles.color.white,
    fontSize: 12
  },
});

export default BloodRequestScreen;
