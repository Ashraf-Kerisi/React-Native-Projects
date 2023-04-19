import React, { useState, useEffect } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, SafeAreaView, View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { db } from '../../config';
import { ref, onChildAdded, update, set, onValue } from 'firebase/database';
import { MultipleSelectList } from 'react-native-dropdown-select-list'

// import Button from 'react-native-button';
import { AppStyles } from '../AppStyles';


function SubjectsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState([]);

  const categories = [
    { key: '1', value: 'Information Technology' },
    { key: '2', value: 'Language' },
    { key: '3', value: 'Math' },
    { key: '4', value: 'Physical Science' },
    { key: '5', value: 'Artificial Intelligence' },
    { key: '6', value: 'English' },
    { key: '7', value: 'Medicale' },
  ]

  const [subjectName, setSubjectName] = useState('');

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
    const myTutorRef = ref(db, 'tutors/');
    onValue(myTutorRef, (snapshot) => {
      const message = snapshot.val();
      setFilteredDataSource(message);
      setMasterDataSource(message);
      console.log(message);
      setNotifications(message);
    });

    // Clean up listener
    return () => {
      myTutorRef.off();
    };

  }, []);


  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  function subjectsView(subjects) {
    return subjects.map((item, index) => <Text style={{ color: 'lightskyblue' }} key={index}>{index > 0 ? ', ' : ''} {item} </Text>);
  }

  const ItemView = ({ item }) => {
    return (
      // Flat List Item
      <View style={styles.item}>
        <Text style={styles.thumbnail}>📘</Text>
        <View>
          <Text style={styles.name} onPress={() => getItem(item)}>{item.name} ({item.experience_years} Years Exp.)</Text>
          <Text>Pricing: ${item.hourly_rate}/hr</Text>
          <Text style={styles.address}>{subjectsView(item.subjects)}</Text>
        </View>
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const addSubjcet=()=>{
    if(subjectName){
      alert('saving...')
      setModalVisible(!modalVisible)
    }else{
      alert('Subject name is required')
    }
   
  }

  const getItem = (item) => {
    // Function for click on an item
    alert('Id : ' + item.id + ' Title : ' + item.title);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{textAlign:'center'}}>Nothing to show.</Text>
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>


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
            <Text style={{ marginBottom: 20 }}>Add New Subject</Text>
            <View style={styles.InputContainer}>
              <TextInput
                style={styles.body}
                placeholder="Subject Name"
                onChangeText={setSubjectName}
                value={subjectName}
                placeholderTextColor={AppStyles.color.grey}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={{ margin: 8, alignContent: 'flex-start', width: '95%' }}>
              <Text style={{ marginBottom: 10 }}>Select Categories (if applicable)</Text>
              <MultipleSelectList
                setSelected={(val) => setSelected(val)}
                data={categories}
                save="value"
                label="Categories"
              />
            </View>
            <View style={{ width: '90%', margin: 10 }}>
              <TouchableOpacity
                style={[styles.buttonContainer, { alignSelf: 'flex-start' }]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!subjectName}
                style={[styles.buttonContainer, { alignSelf: 'flex-end', marginLeft: 10, marginTop: -40, backgroundColor:subjectName?AppStyles.color.tint:'grey' }]}
                onPress={() => addSubjcet()}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5
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
    fontSize: 16,
    color: 'black'
  },
  address: {
    fontSize: 14,
    color: 'black'
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
  InputContainer: {
    width: '100%',
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
  buttonContainer: {
    alignItems: 'center',
    width: '45%',
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
  },
  buttonText: {
    color: AppStyles.color.white,
  },
  checkbox: {
    marginBottom: 10
  }
});
export default SubjectsScreen;
