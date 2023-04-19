import firebase from 'firebase/compat/app'
import {getDatabase} from 'firebase/database'
import {getAuth} from 'firebase/auth'

const firebaseConfig ={
  apiKey: "AIzaSyDJi-cMAJ7Eo2qW4athusz-xusyXlWGK6E",
  authDomain: "mytutor-616e6.firebaseapp.com",
  databaseURL: "https://mytutor-616e6-default-rtdb.firebaseio.com/",
  projectId: "mytutor-616e6",
  storageBucket: "mytutor-616e6.appspot.com",
  messagingSenderId: "342072652782",
  appId: "1:342072652782:web:894d88792b2f76ee01d4ff"
}


if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig)
}

const db = getDatabase();
const auth=getAuth();
export {db,auth}

