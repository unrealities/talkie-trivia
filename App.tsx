import { Slot, SplashScreen } from "expo-router"
import React, { useEffect, useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { useFonts } from "expo-font"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

import { firebaseConfig } from "./src/config/firebase"
import { AppProvider, useAppContext } from "./src/contexts/appContext"
import LoadingIndicator from "./src/components/loadingIndicator"
import ErrorMessage from "./src/components/errorMessage"
import useMovieData from "./src/utils/hooks/useMovieData"
import useNetworkStatus from "./src/utils/hooks/useNetworkStatus"
import usePlayerData from "./src/utils/hooks/usePlayerData"
import { useAuthentication } from "./src/utils/hooks/useAuthentication"

initializeApp(firebaseConfig)
getFirestore()

const App = () => {
  const { dispatch } = useAppContext()
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

  // const [fontsLoaded, setFontsLoaded] = useState(false);
  const fontsLoaded = true // Manually set to true for testing
  const [fontError, setFontError] = useState<Error | null>(null)

  // useEffect(() => {
  //   const loadFonts = async () => {
  //     try {
  //       const [loaded] = await useFonts({
  //         "Arvo-Bold": require("./assets/fonts/Arvo-Bold.ttf"),
  //         "Arvo-Italic": require("./assets/fonts/Arvo-Italic.ttf"),
  //         "Arvo-Regular": require("./assets/fonts/Arvo-Regular.ttf"),
  //       });
  //       setFontsLoaded(loaded);
  //       if (!loaded) {
  //         setFontError(new Error("Failed to load fonts"));
  //       }
  //     } catch (error) {
  //       setFontError(error);
  //     }
  //   };

  //   loadFonts();
  // }, []);

  // useEffect(() => {
  //   if (fontsLoaded) {
  //     console.log("Fonts loaded successfully!");
  //   } else if (fontError) {
  //     console.error("Error loading fonts:", fontError);
  //   }
  // }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Initialize player data only after authentication state is determined
    if (!authLoading) {
      initializePlayer()
    }
  }, [user, authLoading, initializePlayer]) // Depend on both user and authLoading

  useEffect(() => {
    let isInitialMovieLoad = true
    let isInitialBasicMovieLoad = true
    const prepareApp = async () => {
      try {
        if (isNetworkConnected) {
          if (isInitialMovieLoad && movies.length > 0) {
            dispatch({ type: "SET_MOVIES", payload: movies })
            isInitialMovieLoad = false
          }
          if (isInitialBasicMovieLoad && basicMovies.length > 0) {
            dispatch({ type: "SET_BASIC_MOVIES", payload: basicMovies })
            isInitialBasicMovieLoad = false
          }
        }
      } catch (error) {
        console.error("Error preparing app:", error)
      } finally {
        setIsAppReady(true)
        await SplashScreen.hideAsync()
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

  if (!isAppReady || authLoading) {
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

const AppWrapper = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  )
}

export default AppWrapper
