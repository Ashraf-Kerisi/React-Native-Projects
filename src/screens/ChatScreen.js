import React, { useState } from 'react';
import { StyleSheet, Text, Linking, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'


// import Button from 'react-native-button';
import { AppStyles } from '../AppStyles';


function ChatScreen({ navigation }) {
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [selected, setSelected] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");


  const [notifications, setNotifications]=useState([
    {
        id: 1,
        name: 'John Doe',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
        address: 'Office No.03 , Mateen Orchard ,Plaza No, 163',
        city:'Islamabad',
        bloodGroup: 'B+'
      },
      {
        id: 2,
        name: 'Jane Doe',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
        address: 'H.4, Street 45 , Mateen Orchard ,Plaza No, 163',
        city:'Islamabad',
        bloodGroup: 'A+'
      },
      {
        id: 3,
        name: 'John Doe',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
        address: 'Office No.03 , Mateen Orchard ,Plaza No, 163',
        city:'Karachi',
        bloodGroup: 'O+'
      },
      {
        id: 4,
        name: 'Jane Doe',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
        address: 'Office No.03 , Mateen Orchard ,Plaza No, 163',
        city:'Lahore',
        bloodGroup: 'AB+'
      },
      {
        id: 5,
        name: 'John Doe',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
        address: 'Office No.03 , Mateen Orchard ,Plaza No, 163',
        city:'Islamabad',
        bloodGroup: 'AB+'
      },
      {
        id: 6,
        name: 'Jane Doe',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
        address: 'Office No.03 , Mateen Orchard ,Plaza No, 163',
        city:'Lahore',
        bloodGroup: 'AB+'
      },
      {
        id: 7,
        name: 'John Doe',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
        address: 'Office No.03 , Mateen Orchard ,Plaza No, 163',
        city:'Karachi',
        bloodGroup: 'AB+'
      },
      {
        id: 8,
        name: 'Jane Doe',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
        address: 'Office No.03 , Mateen Orchard ,Plaza No, 163',
        city:'Islamabad',
        bloodGroup: 'AB+'
      },
      {
        id: 9,
        name: 'John Brk',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
        address: 'Office No.03 , Mateen Orchard ,Plaza No, 163',
        city:'Islamabad',
        bloodGroup: 'A+'
      },
      {
        id: 10,
        name: 'Kalim sal',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
        address: 'Office No.03 , Mateen Orchard ,Plaza No, 163',
        city:'Islamabad',
        bloodGroup: 'B+'
      },
      {
        id: 11,
        name: 'David Kap',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
        address: 'Office No.03 , Mateen Orchard ,Plaza No, 163',
        city:'Islamabad',
        bloodGroup: 'A-'
      },
      {
        id: 12,
        name: 'Umal Patik',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
        address: 'Office No.03 , Mateen Orchard ,Plaza No, 163',
        city:'Karachi',
        bloodGroup: 'A-'
      },
      // add more users here...
    ]);
  
  const [message, setMessage]=useState(null);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={{ width: '55%' }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.address}>{item.address} </Text>
      </View>
      <View style={{width:'25%', alignItems:'flex-end', paddingTop:16}}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'red', alignSelf:'flex-end'}}>{item.bloodGroup}</Text>
        <View style={styles.itemContact}>
        <TouchableOpacity>
          <Text onPress={()=>{Linking.openURL('sms:9211886204');}} style={{fontSize:28, marginRight:10, color:'black'}}>✉</Text>
        </TouchableOpacity>
        <TouchableOpacity >
          <Text onPress={()=>{Linking.openURL('tel:9211886204');}} style={{fontSize:14, marginBottom:-8, color:'black'}}>📞</Text>
        </TouchableOpacity>
        </View>
        
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {
        notifications.length?
      (
        <View>
      <Text style={{marginTop: '5%',}}>{notifications.length} contacts available. </Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={{ width: '90%', marginBottom: 50 }}
      /></View>):<Text style={{marginTop: '5%',}}>{message}</Text>
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
    marginTop: 15,
    borderStyle: 'solid',
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
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
    margin: 10
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom:5
  },
  itemContact:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 16,
    borderRadius:50
  },
  name: {
    fontSize: 16,
    color:'black'
  },
  address: {
    fontSize: 11,
    color:'black'
  }
});

export default ChatScreen;
