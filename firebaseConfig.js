import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPozD3NjNWxjmxUAhu0T8p6YdPJemfRQE",
  authDomain: "carbontracker-bbaca.firebaseapp.com",
  projectId: "carbontracker-bbaca",
  storageBucket: "carbontracker-bbaca.firebasestorage.app",
  messagingSenderId: "880717940655",
  appId: "1:880717940655:web:019ec0ffb0ee0c3b8d115a",
  measurementId: "G-SSVGSMK7CG",
};

// Inicializar app
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
export const db = getFirestore(app);
