// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- הוספנו את השורה הזו
// import { getDatabase } from "firebase/database"; // בטל את ההערה אם אתה משתמש ב-Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMhbpBtajAAIP8DYCa6yyb1hsxgMvieWM",
  authDomain: "where-on-earth-is-this-bf2fb.firebaseapp.com",
  projectId: "where-on-earth-is-this-bf2fb",
  storageBucket: "where-on-earth-is-this-bf2fb.firebasestorage.app",
  messagingSenderId: "659898780718",
  appId: "1:659898780718:web:d3ac56b7a7f02b11bd63bf",
  measurementId: "G-4FPB791TKY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app); // <-- הוספנו את השורה הזו כדי לייצא את מופע ה-Firestore

// אם אתה משתמש ב-Realtime Database במקום Firestore, בטל את ההערה על השורה הבאה:
// export const rtdb = getDatabase(app);