import React from "react"
import { registerRootComponent } from "expo"
import { ExpoRoot } from "expo-router"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { firebaseConfig } from "./src/config/firebase"

initializeApp(firebaseConfig)
getFirestore()

export function App() {
  const ctx = require.context("./src/app")
  return <ExpoRoot context={ctx} />
}

export default registerRootComponent(App)
