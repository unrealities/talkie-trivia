import React, { useEffect, useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { useFonts } from "expo-font"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

import { AppProvider } from "./src/contexts/appContext"
import { firebaseConfig } from "./src/config/firebase"
import LoadingIndicator from "./src/components/loadingIndicator"
import ErrorMessage from "./src/components/errorMessage"
import useMovieData from "./src/utils/hooks/useMovieData"
import usePlayerData from "./src/utils/hooks/usePlayerData"
import { useAuthentication } from "./src/utils/hooks/useAuthentication"
import { Slot } from "expo-router"

initializeApp(firebaseConfig)
getFirestore()

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [fontError, setFontError] = useState<Error | null>(null)

  useEffect(() => {
    const loadFonts = async () => {
      try {
        const [loaded] = await useFonts({
          "Arvo-Bold": require("./assets/fonts/Arvo-Bold.ttf"),
          "Arvo-Italic": require("./assets/fonts/Arvo-Italic.ttf"),
          "Arvo-Regular": require("./assets/fonts/Arvo-Regular.ttf"),
        })
        setFontsLoaded(loaded)
        if (!loaded) {
          setFontError(new Error("Failed to load fonts"))
        }
      } catch (error) {
        setFontError(error)
      }
    }

    loadFonts()
  }, [])

  if (!fontsLoaded) {
    return <LoadingIndicator />
  }

  if (fontError) {
    return <ErrorMessage message={fontError.message} />
  }

  return (
    <AppProviderWrapper /> // Wrap the main logic in a new component
  )
}

// New component to handle data loading and context provision
const AppProviderWrapper: React.FC = () => {
  console.log("AppProviderWrapper: Rendering")
  const { authLoading } = useAuthentication()
  console.log("AppProviderWrapper: authLoading =", authLoading)
  const {
    movies,
    basicMovies,
    loading: movieDataLoading,
    error: movieDataError,
  } = useMovieData()
  const {
    loading: playerDataLoading,
    error: playerDataError,
    initializePlayer,
  } = usePlayerData()

  const [isAppReady, setIsAppReady] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      initializePlayer()
    }
  }, [authLoading, initializePlayer])

  useEffect(() => {
    if (
      !movieDataLoading &&
      !playerDataLoading &&
      !authLoading &&
      movies.length > 0 &&
      basicMovies.length > 0
    ) {
      setIsAppReady(true)
    }
  }, [
    movieDataLoading,
    playerDataLoading,
    authLoading,
    movies.length,
    basicMovies.length,
  ])

  if (authLoading || !isAppReady) {
    return <LoadingIndicator />
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {movieDataError ? (
        <ErrorMessage message={"Error loading movie data"} />
      ) : (
        <Slot />
      )}
    </SafeAreaProvider>
  )
}

export default App
