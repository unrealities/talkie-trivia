import Constants from "expo-constants"
import { initializeApp, getApps, getApp } from "firebase/app"
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore"
import { getPerformance } from "firebase/performance"

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
}

const firebaseConfig: FirebaseConfig = {
  apiKey: Constants?.expoConfig?.extra?.firebaseApiKey,
  authDomain: `${Constants?.expoConfig?.extra?.firebaseProjectId}.firebaseapp.com`,
  projectId: Constants?.expoConfig?.extra?.firebaseProjectId,
  storageBucket: `${Constants?.expoConfig?.extra?.firebaseProjectId}.appspot.com`,
  messagingSenderId: Constants?.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants?.expoConfig?.extra?.firebaseAppId,
  measurementId: Constants?.expoConfig?.extra?.firebaseMeasurementId,
}

console.log("firebase.tsx: attempting to initilize firebase app")
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
console.log("firebase.tsx: firebase app initialized")

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ cacheSizeBytes: CACHE_SIZE_UNLIMITED }),
})

enableMultiTabIndexedDbPersistence(db)
  .then(() => console.log("Multi-tab persistence enabled"))
  .catch((err) => console.error("Failed to enable multi-tab persistence:", err))

const perf = getPerformance(app)

export { db, firebaseConfig, perf }
