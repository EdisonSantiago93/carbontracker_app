import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Preferir variables de entorno (ej: usando app.config.js / expo constants o un .env en desarrollo)
// Si no se configuran variables, usamos los valores actuales como fallback para no romper la app.
// NOTA: Para producción mueva estas claves fuera del repositorio y use secret manager / app config.

// Prefer expo constants extra — app.config.js injects these at build time.
const extras = (Constants.expoConfig && Constants.expoConfig.extra) || {};
const firebaseConfig = {
  apiKey: extras.FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || 'AIzaSyDPozD3NjNWxjmxUAhu0T8p6YdPJemfRQE',
  authDomain: extras.FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || 'carbontracker-bbaca.firebaseapp.com',
  projectId: extras.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'carbontracker-bbaca',
  storageBucket: extras.FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || 'carbontracker-bbaca.firebasestorage.app',
  messagingSenderId: extras.FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '880717940655',
  appId: extras.FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '1:880717940655:web:019ec0ffb0ee0c3b8d115a',
  measurementId: extras.FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID || 'G-SSVGSMK7CG',
};

// Inicializar app
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
export const db = getFirestore(app);
