import React from "react"
import { registerRootComponent } from "expo"
import { ExpoRoot } from "expo-router"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { firebaseConfig } from "./src/config/firebase"

// Initialize Firebase here, before the application renders
initializeApp(firebaseConfig)
getFirestore()

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./src/app")
  return <ExpoRoot context={ctx} />
}

registerRootComponent(App)
