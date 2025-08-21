import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import {
  initializeFirestore,
  getFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore,
} from "firebase/firestore"
import Constants from "expo-constants"

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

try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      tabManager: persistentMultipleTabManager(),
    }),
  })
} catch (e: any) {
  if (e.code === "failed-precondition") {
    console.warn("Firestore already initialized. Re-using existing instance.")
  }
  db = getFirestore(app)
}

export { app, db }
