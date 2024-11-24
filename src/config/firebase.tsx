import Constants from "expo-constants"
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { Analytics, getAnalytics, isSupported } from "firebase/analytics"

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
}

// Validate Firebase configuration
const validateFirebaseConfig = (
  config: Partial<FirebaseConfig>
): config is FirebaseConfig => {
  const requiredFields: (keyof FirebaseConfig)[] = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
    "measurementId",
  ]

  for (const field of requiredFields) {
    if (!config[field]) {
      console.error(`Missing Firebase configuration field: ${field}`)
      return false
    }
  }

  return true
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

if (!validateFirebaseConfig(firebaseConfig)) {
  throw new Error(
    "Invalid Firebase configuration. Check your environment variables."
  )
}

// Initialize Firebase app if not already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

// Initialize Analytics if supported (can be used later if needed)
let analytics: Analytics | null = null
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
  .catch((error) => {
    console.warn("Analytics initialization failed:", error)
  })

export { app, db, firebaseConfig, analytics }

// Helper to check if Firebase is initialized
export const isFirebaseInitialized = (): boolean => {
  return getApps().length > 0
}

// Export initialize function for explicit initialization if needed
export const initializeFirebase = () => {
  if (!isFirebaseInitialized()) {
    if (!validateFirebaseConfig(firebaseConfig)) {
      throw new Error(
        "Invalid Firebase configuration. Check your environment variables."
      )
    }
    initializeApp(firebaseConfig)
  }
  return {
    app: getApp(),
    db: getFirestore(getApp()),
  }
}
