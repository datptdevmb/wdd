import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot ,query,orderBy,limit,getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

    apiKey: "AIzaSyDbYzbWF9UdhTizRzecoG7bGsF1GqolKEM",
    authDomain: "chat-app-de681.firebaseapp.com",

    databaseURL: "https://chat-app-de681-default-rtdb.firebaseio.com",

    projectId: "chat-app-de681",

    storageBucket: "chat-app-de681.appspot.com",

    messagingSenderId: "842859751304",

    appId: "1:842859751304:web:9a40fb38ec14a27fea3c3d",

    measurementId: "G-B3ZHH0GNGY"

};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc, onSnapshot, ref, uploadBytes, getDownloadURL , query, orderBy, limit, getDocs  };
