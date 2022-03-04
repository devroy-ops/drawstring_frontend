import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB3sW6uepa5b51lmCf3rLJ5xOHypHCtUUU",
    authDomain: "drawstring-react-test.firebaseapp.com",
    projectId: "drawstring-react-test",
    storageBucket: "drawstring-react-test.appspot.com",
    messagingSenderId: "686027027449",
    appId: "1:686027027449:web:0c6d6f00dc8747ec40c328",
    measurementId: "G-SKE2QJ82TJ"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const fb = firebase;
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, db, fb, storage };
