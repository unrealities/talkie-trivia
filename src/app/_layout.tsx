import React, { useEffect, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { useFonts } from "expo-font"
import { Slot } from "expo-router"

import { AppProvider } from "../contexts/appContext"
import LoadingIndicator from "../components/loadingIndicator"
import ErrorMessage from "../components/errorMessage"

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    "Arvo-Bold": require("../../assets/fonts/Arvo-Bold.ttf"),
    "Arvo-Italic": require("../../assets/fonts/Arvo-Italic.ttf"),
    "Arvo-Regular": require("../../assets/fonts/Arvo-Regular.ttf"),
  })

  if (!fontsLoaded) {
    console.log("fonts not loaded")
    return <LoadingIndicator />
  }

  if (fontError) {
    return <ErrorMessage message={fontError.message} />
  }

  return (
    <AppProvider>
      <StatusBar style="auto" />
      <Slot />
    </AppProvider>
  )
}

export default RootLayout
