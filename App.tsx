import React, { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

import { firebaseConfig } from "./src/config/firebase"
import { AppProvider, useAppContext } from "./src/contexts/AppContext"
import { colors } from "./src/styles/global"
import ErrorMessage from "./src/components/errorMessage"
import LoadingIndicator from "./src/components/loadingIndicator"
import GameScreen from "./src/screens/gameScreen"
import ProfileScreen from "./src/screens/profileScreen"
import useMovieData from "./src/utils/hooks/useMovieData"
import useNetworkStatus from "./src/utils/hooks/useNetworkStatus"
import usePlayerData from "./src/utils/hooks/usePlayerData"

initializeApp(firebaseConfig)
getFirestore()

SplashScreen.preventAutoHideAsync()

const Tab = createBottomTabNavigator()

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

  const [fontsLoaded] = useFonts({
    "Arvo-Bold": require("./assets/fonts/Arvo-Bold.ttf"),
    "Arvo-Italic": require("./assets/fonts/Arvo-Italic.ttf"),
    "Arvo-Regular": require("./assets/fonts/Arvo-Regular.ttf"),
  })

  useEffect(() => {
    // Initialize player data as soon as user is available, even if there's no user
    initializePlayer()
  }, [])

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

    if (fontsLoaded && !movieDataLoading && !playerDataLoading) {
      prepareApp()
    }
  }, [
    fontsLoaded,
    isNetworkConnected,
    movieDataLoading,
    playerDataLoading,
    movies,
    basicMovies,
  ])

  if (!isAppReady) {
    return <LoadingIndicator />
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {movieDataError ? (
        <ErrorMessage message={"Error loading movie data"} />
      ) : (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarLabelStyle: { fontFamily: "Arvo-Bold", fontSize: 16 },
          }}
        >
          <Tab.Screen name="Game" component={GameScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
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
