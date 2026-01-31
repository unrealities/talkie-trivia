import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import {
  initializeFirestore,
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore"
import {
  initializeAuth,
  getAuth,
  Auth,
  connectAuthEmulator,
} from "firebase/auth"
import * as FirebaseAuth from "firebase/auth"
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"
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

try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: __DEV__ && Platform.OS === "android",
  })
} catch (e: any) {
  db = getFirestore(app)
}

if (Platform.OS === "web") {
  auth = getAuth(app)
} else {
  try {
    const { getReactNativePersistence } = FirebaseAuth as any

    if (getReactNativePersistence) {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      })
    } else {
      auth = getAuth(app)
    }
  } catch (e: any) {
    // If auth is already initialized (hot reload), use existing instance
    auth = getAuth(app)
  }
}

if (__DEV__) {
  console.log("🔧 Connecting to Firebase Emulators...")
  const host = Platform.OS === "android" ? "10.0.2.2" : "localhost"

  try {
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true })
    connectFirestoreEmulator(db, host, 8080)
    connectFunctionsEmulator(getFunctions(app), host, 5001)
    console.log("✅ Connected to Emulators")
  } catch (e) {
    console.log("Emulators already connected or failed")
  }
}

export { app, db, auth }
