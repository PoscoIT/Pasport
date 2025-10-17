import {initializeApp,getApps} from 'firebase/app';
import { initializeFirestore  } from 'firebase/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyB5xOYtAleXMTivI0cp7RABtPjuUvSDagA",
  authDomain: "tstappmobil-8edc6.firebaseapp.com",
  databaseURL: "https://tstappmobil-8edc6-default-rtdb.firebaseio.com",
  projectId: "tstappmobil-8edc6",
  storageBucket: "tstappmobil-8edc6.firebasestorage.app",
  messagingSenderId: "998655450144",
  appId: "1:998655450144:web:a6b13101d672a8e7d37045",
  measurementId: "G-ERC0V98YDJ"
};
let app, auth;

if (!getApps().length){
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
}




export  default  app
