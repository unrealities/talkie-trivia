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
import useNetworkStatus from "./src/utils/hooks/useNetworkStatus"
import usePlayerData from "./src/utils/hooks/usePlayerData"
import { useAuthentication } from "./src/utils/hooks/useAuthentication"
import { Slot } from "expo-router"

initializeApp(firebaseConfig)
getFirestore()

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false)
  const { isNetworkConnected } = useNetworkStatus()
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
  const { user, authLoading } = useAuthentication() // Get user and authLoading here

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

  useEffect(() => {
    // Initialize player data only after authentication state is determined
    if (!authLoading) {
      initializePlayer()
    }
  }, [user, authLoading, initializePlayer])

  useEffect(() => {
    let isInitialMovieLoad = true
    let isInitialBasicMovieLoad = true
    const prepareApp = async () => {
      try {
        if (isNetworkConnected) {
          if (isInitialMovieLoad && movies.length > 0) {
            isInitialMovieLoad = false
          }
          if (isInitialBasicMovieLoad && basicMovies.length > 0) {
            isInitialBasicMovieLoad = false
          }
        }
      } catch (error) {
        console.error("Error preparing app:", error)
      } finally {
        setIsAppReady(true)
      }
    }

    if (
      fontsLoaded &&
      !movieDataLoading &&
      !playerDataLoading &&
      !authLoading
    ) {
      prepareApp()
    }
  }, [
    fontsLoaded,
    isNetworkConnected,
    movieDataLoading,
    playerDataLoading,
    authLoading,
    movies,
    basicMovies,
  ])

  if (!isAppReady || authLoading || !fontsLoaded) {
    return <LoadingIndicator />
  }

  return (
    <AppProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        {movieDataError ? (
          <ErrorMessage message={"Error loading movie data"} />
        ) : (
          <Slot />
        )}
      </SafeAreaProvider>
    </AppProvider>
  )
}

export default App
