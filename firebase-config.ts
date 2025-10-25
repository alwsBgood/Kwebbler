// 1. Import the functions you need from the SDKs you need
// FIX: Use namespaced imports for compatibility with the Firebase v8 SDK.
import firebase from "firebase/app";
import "firebase/database";

// TODO: Add your own Firebase configuration from your Firebase project
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 2. Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 3. Get a reference to the database service
export const database = firebase.database();