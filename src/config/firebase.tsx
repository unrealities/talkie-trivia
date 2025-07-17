import { initializeApp, getApps, getApp } from "firebase/app"
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore"
import { getPerformance } from "firebase/performance"
import { getAnalytics, isSupported } from "firebase/analytics"
import Constants from "expo-constants"

const firebaseConfig: FirebaseConfig = {
  apiKey: Constants?.expoConfig?.extra?.firebaseApiKey,
  authDomain: `${Constants?.expoConfig?.extra?.firebaseProjectId}.firebaseapp.com`,
  projectId: Constants?.expoConfig?.extra?.firebaseProjectId,
  storageBucket: `${Constants?.expoConfig?.extra?.firebaseProjectId}.appspot.com`,
  messagingSenderId: Constants?.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants?.expoConfig?.extra?.firebaseAppId,
  measurementId: Constants?.expoConfig?.extra?.firebaseMeasurementId,
}

if (__DEV__) {
  console.log("firebase.tsx: attempting to initialize firebase app")
}
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
if (__DEV__) {
  console.log("firebase.tsx: firebase app initialized")
}

let analytics
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
      if (__DEV__) {
        console.log("firebase.tsx: Firebase Analytics initialized.")
      }
    } else {
      if (__DEV__) {
        console.log(
          "firebase.tsx: Firebase Analytics not supported in this environment."
        )
      }
    }
  })
  .catch((error) => {
    console.error("firebase.tsx: Error checking Analytics support:", error)
  })

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    tabManager: persistentMultipleTabManager(),
  }),
})

const perf = getPerformance(app)

export { db, firebaseConfig, perf, app, analytics }
