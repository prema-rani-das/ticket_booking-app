// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  writeBatch
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDrHR7X7aKK1JSZogbJ_ezr43VihkjOaqM",
  authDomain: "smart-ticket-booking-253a4.firebaseapp.com",
  projectId: "smart-ticket-booking-253a4",
  storageBucket: "smart-ticket-booking-253a4.firebasestorage.app",
  messagingSenderId: "477314746202",
  appId: "1:477314746202:web:6ca46d6e3f5d8c3c86d563",
  measurementId: "G-JS5XSJ7W0M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Export all
export {
  auth,
  db,
  storage,
  analytics,
  googleProvider,  // ✅ এইটা export করতে হবে
  // Auth functions
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,  // ✅ এইটা export করতে হবে
  // Firestore functions
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  writeBatch,
  // Storage functions
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};

export default app;