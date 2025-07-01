// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJoAO8mICfAz8Uckk4XLVS1ocTUMiqO8Y",
  authDomain: "whereonearthisthis-3de6b.firebaseapp.com",
  projectId: "whereonearthisthis-3de6b",
  storageBucket: "whereonearthisthis-3de6b.firebasestorage.app",
  messagingSenderId: "900375718437",
  appId: "1:900375718437:web:6e9f8aa0bb4f7cdb72edcc",
  measurementId: "G-NSDCN2HDCZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  serverTimestamp
};