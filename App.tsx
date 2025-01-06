import React, { useEffect, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { useFonts } from "expo-font"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

import { AppProvider } from "./src/contexts/appContext"
import { firebaseConfig } from "./src/config/firebase"
import LoadingIndicator from "./src/components/loadingIndicator"
import ErrorMessage from "./src/components/errorMessage"
import { Slot } from "expo-router"

initializeApp(firebaseConfig)
getFirestore()

const App = () => {
  const [fontsLoaded, fontError] = useFonts({
    "Arvo-Bold": require("./assets/fonts/Arvo-Bold.ttf"),
    "Arvo-Italic": require("./assets/fonts/Arvo-Italic.ttf"),
    "Arvo-Regular": require("./assets/fonts/Arvo-Regular.ttf"),
  });

  if (!fontsLoaded) {
    console.log("fonts not loaded")
    return <LoadingIndicator />;
  }

  if (fontError) {
    return <ErrorMessage message={fontError.message} />;
  }

  return (
    <AppProvider>
      <StatusBar style="auto" />
      <Slot />
    </AppProvider>
  )
}

export default App
