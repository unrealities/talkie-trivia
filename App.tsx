import React, { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useAuthentication } from "./src/utils/hooks/useAuthentication"
import {
  getUserID,
  getUserName,
  setUserName,
} from "./src/utils/hooks/localStore"
import { initializeFirebase } from "./src/config/firebase"
import {
  updatePlayer,
  updatePlayerGame,
  updatePlayerStats,
} from "./src/utils/firebaseService"
import { useAppState } from "./src/hooks/useAppState"
import { ErrorView } from "./src/components/errorView"
import { LoadingView } from "./src/components/loadingView"
import { TabNavigator } from "./src/navigation/tabNavigator"

// Initialize Firebase
initializeFirebase()

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

const App: React.FC = () => {
  const { user } = useAuthentication()
  const [fontsLoaded] = useFonts({
    "Arvo-Bold": require("./assets/fonts/Arvo-Bold.ttf"),
    "Arvo-Italic": require("./assets/fonts/Arvo-Italic.ttf"),
    "Arvo-Regular": require("./assets/fonts/Arvo-Regular.ttf"),
  })

  // Custom hook to manage app state
  const {
    isAppReady,
    isNetworkConnected,
    loadingError,
    player,
    playerGame,
    playerStats,
    setPlayerGame,
    retryLoadResources,
  } = useAppState({ fontsLoaded })

  // Effect to update player data when user changes
  useEffect(() => {
    const updatePlayerData = async () => {
      if (user && player.name !== user.displayName) {
        const result = await updatePlayer(
          player,
          getUserID,
          getUserName,
          setUserName
        )
        if (result) console.log("Player data updated.")
      }
    }
    if (user) updatePlayerData()
  }, [user, player.name])

  // Effect to update player stats
  useEffect(() => {
    const updateStats = async () => {
      if (!playerStats) return

      const updatedStats = await updatePlayerStats(playerStats, player.id)
      if (updatedStats.updated) {
        console.log("Player stats updated.")
      }
    }
    updateStats()
  }, [playerStats, player.id])

  // Effect to update game data
  useEffect(() => {
    const updateGame = async () => {
      if (!playerGame) return

      const updated = await updatePlayerGame(playerGame)
      if (updated) console.log("Player game data updated.")
    }
    updateGame()
  }, [playerGame])

  if (!isNetworkConnected) {
    return (
      <ErrorView
        message="No Internet Connection"
        onRetry={retryLoadResources}
      />
    )
  }

  if (!isAppReady) {
    return <LoadingView error={loadingError} onRetry={retryLoadResources} />
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <TabNavigator
        player={player}
        playerGame={playerGame}
        playerStats={playerStats}
        setPlayerGame={setPlayerGame}
        isNetworkConnected={isNetworkConnected}
      />
    </NavigationContainer>
  )
}

export default App
