import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, FlatList,TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { db } from '../../config';
import { ref, onChildAdded, update,set, onValue } from 'firebase/database';

// import Button from 'react-native-button';
import { AppStyles } from '../AppStyles';


function TutorsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userLogedIn')
      jsonValue != null ? setUserLogedIn(JSON.parse(jsonValue)) : null;
    } catch (e) {
      // error reading value
    }
  }

  useEffect( () => {
    getData()
    // Set up listener for new messages
    const myTutorRef = ref(db, 'tutors/');
     onValue(myTutorRef, (snapshot) => {
      const message = snapshot.val();     
      setFilteredDataSource(message);
      setMasterDataSource(message);
      console.log('see tutors here')
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

function subjectsView(subjects){
  return subjects.map((item, index) => <Text style={{color:'lightskyblue'}} key={index}>{index>0?', ':''} {item} </Text> );
}

  const ItemView = ({item}) => {
    return (
      // Flat List Item
      <View style={styles.item}>
      <Text style={styles.thumbnail}>📘</Text>
      <View>
      <Text style={styles.name}   onPress={() => getItem(item)}>{item.name} ({item.experience_years} Years Exp.)</Text>
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

  const getItem = (item) => {
    // Function for click on an item
    alert('Id : ' + item.id + ' Title : ' + item.title);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search Subjects Here"
        />
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
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
  }
});
export default TutorsScreen;
