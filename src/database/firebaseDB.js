// firebase.js
import { initializeApp, getApps, getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getDatabase } from "@react-native-firebase/database";
import { getFirestore } from "@react-native-firebase/firestore";
import { getMessaging } from "@react-native-firebase/messaging";

// Firebase app'ı initialize et (sadece bir kez)
const firebaseConfig = {
  apiKey: "AIzaSyB5xOYtAleXMTivI0cp7RABtPjuUvSDagA",
  authDomain: "tstappmobil-8edc6.firebaseapp.com",
  databaseURL: "https://tstappmobil-8edc6-default-rtdb.firebaseio.com",
  projectId: "tstappmobil-8edc6",
  storageBucket: "tstappmobil-8edc6.firebasestorage.app",
  messagingSenderId: "998655450144",
  appId: "1:998655450144:web:a6b13101d672a8e7d37045",
  measurementId: "G-ERC0V98YDJ",
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Modülleri app ile birlikte al
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);
const messaging = getMessaging(app);

export { app, auth, database, firestore, messaging };
