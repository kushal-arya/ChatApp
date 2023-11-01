import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";


// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyA6_f5gCSrqDbo5CV_u4Xbvjoxv7gWvSa8",
    authDomain: "chatapp-7b392.firebaseapp.com",
    projectId: "chatapp-7b392",
    storageBucket: "chatapp-7b392.appspot.com",
    messagingSenderId: "951383101209",
    appId: "1:951383101209:web:53c5e7f2e3627653f83f88",
    measurementId: "G-6RDRGBYQ7M"
};

// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
