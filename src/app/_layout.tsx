import React from "react"
import { useFonts } from "expo-font"
import { Stack } from "expo-router/stack"
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
      <Stack>
        <Stack.Screen name="game" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  )
}

export default RootLayout
