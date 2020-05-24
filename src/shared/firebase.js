import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD1GYAgBteBkLHKtmmXrvsqKFxoRr2O-R8",
    authDomain: "work2gather-e8973.firebaseapp.com",
    databaseURL: "https://work2gather-e8973.firebaseio.com",
    projectId: "work2gather-e8973",
    storageBucket: "work2gather-e8973.appspot.com",
    messagingSenderId: "609218763867",
    appId: "1:609218763867:web:b13aa86c4dba6b4793337e"
  };
  
  firebase.initializeApp(firebaseConfig);

export default firebase;