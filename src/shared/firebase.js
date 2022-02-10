import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyA3XhOF72YE_c5j6J3_fm-hSzApiCi9X90",
  authDomain: "image-community-85b9c.firebaseapp.com",
  projectId: "image-community-85b9c",
  storageBucket: "image-community-85b9c.appspot.com",
  messagingSenderId: "210323321988",
  appId: "1:210323321988:web:2f1eef2e5e9577e8fffed1",
  measurementId: "G-5BPJ5ERV9F",
});

// firebase.initializeApp(firebaseConfig);

// const auth = firebase.auth();

// export {auth};


// const app = initializeApp(firebaseConfig);
const apiKey = "AIzaSyA3XhOF72YE_c5j6J3_fm-hSzApiCi9X90";
const authService = getAuth()
const firestore = getFirestore();
const storage = getStorage();
const realtime = getDatabase();

export const db = getFirestore();
export { authService, apiKey, firestore, storage, realtime };