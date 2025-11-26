import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import {
  initializeFirestore,
  getFirestore,
  Firestore,
} from "firebase/firestore"
import { initializeAuth, getAuth, Auth } from "firebase/auth"
import * as FirebaseAuth from "firebase/auth"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import Constants from "expo-constants"
import { Platform } from "react-native"

const firebaseConfig = {
  apiKey: Constants?.expoConfig?.extra?.firebaseApiKey,
  authDomain: `${Constants?.expoConfig?.extra?.firebaseProjectId}.firebaseapp.com`,
  projectId: Constants?.expoConfig?.extra?.firebaseProjectId,
  storageBucket: `${Constants?.expoConfig?.extra?.firebaseProjectId}.appspot.com`,
  messagingSenderId: Constants?.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants?.expoConfig?.extra?.firebaseAppId,
  measurementId: Constants?.expoConfig?.extra?.firebaseMeasurementId,
}

const app: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig)

let db: Firestore
let auth: Auth

// 1. Initialize Firestore
try {
  // Pass empty settings object to avoid web-specific cache warnings on native
  db = initializeFirestore(app, {})
} catch (e: any) {
  db = getFirestore(app)
}

// 2. Initialize Auth with Platform-Specific Persistence
// We check Platform.OS to avoid crashing on Web (where AsyncStorage isn't needed/supported this way)
if (Platform.OS === "web") {
  auth = getAuth(app)
} else {
  try {
    // We cast FirebaseAuth to 'any' to access getReactNativePersistence
    // This bypasses the TypeScript error if the environment resolves to Web types
    const { getReactNativePersistence } = FirebaseAuth as any

    if (getReactNativePersistence) {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      })
    } else {
      // Fallback if the import fails for some reason
      auth = getAuth(app)
    }
  } catch (e: any) {
    // If auth is already initialized (hot reload), use existing instance
    auth = getAuth(app)
  }
}

export { app, db, auth }
