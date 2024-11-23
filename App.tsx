import React, { useCallback, useEffect, useState } from "react"
import { View, Text, ActivityIndicator, Button } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { useFonts } from "expo-font"
import * as Network from "expo-network"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import uuid from "react-native-uuid"
import { useAuthentication } from "./src/utils/hooks/useAuthentication"
import {
  getUserID,
  getUserName,
  setUserName,
} from "./src/utils/hooks/localStore"
import { colors } from "./src/styles/global"
import { appStyles } from "./src/styles/AppStyles"
import { firebaseConfig } from "./src/config/firebase"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import {
  updatePlayer,
  updatePlayerGame,
  updatePlayerStats,
} from "./src/utils/firebaseService"

import GoogleLogin from "./src/components/googleLogin"
import MoviesContainer from "./src/components/movie"
import PlayerStatsContainer from "./src/components/playerStats"
import Player from "./src/models/player"
import PlayerStats from "./src/models/playerStats"
import { BasicMovie, Movie } from "./src/models/movie"
import { PlayerGame } from "./src/models/game"

initializeApp(firebaseConfig)
const db = getFirestore()

const movies: Movie[] = require("./data/popularMovies.json")
const basicMovies: BasicMovie[] = require("./data/basicMovies.json")

SplashScreen.preventAutoHideAsync()

const App = () => {
  const { user } = useAuthentication()
  const [isAppReady, setIsAppReady] = useState(false)
  const [isNetworkConnected, setIsNetworkConnected] = useState(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [player, setPlayer] = useState<Player>({
    id: uuid.v4().toString(),
    name: "",
  })

  const [movie] = useState<Movie>(movies[new Date().getDate() % movies.length])

  const [playerGame, setPlayerGame] = useState<PlayerGame>({
    correctAnswer: false,
    endDate: new Date(),
    game: { date: new Date(), guessesMax: 5, id: uuid.v4().toString(), movie },
    guesses: [],
    id: uuid.v4().toString(),
    playerID: player.id,
    startDate: new Date(),
  })

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    id: player.id,
    currentStreak: 0,
    games: 1,
    maxStreak: 0,
    wins: [0, 0, 0, 0, 0],
  })

  let [fontsLoaded] = useFonts({
    "Arvo-Bold": require("./assets/fonts/Arvo-Bold.ttf"),
    "Arvo-Italic": require("./assets/fonts/Arvo-Italic.ttf"),
    "Arvo-Regular": require("./assets/fonts/Arvo-Regular.ttf"),
  })

  const loadResources = useCallback(async () => {
    try {
      const networkState = await Network.getNetworkStateAsync()
      setIsNetworkConnected(networkState.isInternetReachable ?? false)

      if (fontsLoaded && networkState.isInternetReachable) {
        setIsAppReady(true)
        await SplashScreen.hideAsync()
      }
    } catch (error) {
      setLoadingError("Error loading resources. Please try again.")
      console.error("Error loading resources: ", error)
    }
  }, [fontsLoaded])

  useEffect(() => {
    loadResources()
  }, [loadResources])

  const retryLoadResources = async () => {
    setLoadingError(null)
    await loadResources()
  }

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

  useEffect(() => {
    const updateStats = async () => {
      const updatedStats = await updatePlayerStats(playerStats, player.id)
      if (updatedStats.updated) {
        setPlayerStats(updatedStats.stats)
        console.log("Player stats updated.")
      }
    }
    if (playerStats) updateStats()
  }, [playerStats, player.id])

  useEffect(() => {
    const updateGame = async () => {
      const updated = await updatePlayerGame(playerGame)
      if (updated) console.log("Player game data updated.")
    }
    if (playerGame) updateGame()
  }, [playerGame])

  const Tab = createBottomTabNavigator()

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {!isNetworkConnected ? (
        <View style={appStyles.errorContainer}>
          <Text style={appStyles.errorText}>No Internet Connection</Text>
          <Button title="Retry" onPress={retryLoadResources} />
        </View>
      ) : isAppReady ? (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarLabelStyle: { fontFamily: "Arvo-Bold", fontSize: 16 },
          }}
        >
          <Tab.Screen name="Game">
            {() => (
              <View style={appStyles.container}>
                <MoviesContainer
                  isNetworkConnected={isNetworkConnected}
                  movies={basicMovies}
                  player={player}
                  playerGame={playerGame}
                  playerStats={playerStats}
                  updatePlayerGame={setPlayerGame}
                />
              </View>
            )}
          </Tab.Screen>
          <Tab.Screen name="Profile">
            {() => (
              <View style={appStyles.container}>
                <GoogleLogin player={player} />
                <PlayerStatsContainer
                  player={player}
                  playerStats={playerStats}
                />
              </View>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <View style={appStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          {loadingError && (
            <Text style={appStyles.errorText}>{loadingError}</Text>
          )}
        </View>
      )}
    </NavigationContainer>
  )
}

export default App
