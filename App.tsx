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
import { batchUpdatePlayerData } from "./src/utils/firebaseService"

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
    id: "",
    name: "",
  })

  const [movie] = useState<Movie>(movies[new Date().getDate() % movies.length])

  const [playerGame, setPlayerGame] = useState<PlayerGame>({
    correctAnswer: false,
    endDate: new Date(),
    game: { date: new Date(), guessesMax: 5, id: uuid.v4().toString(), movie },
    guesses: [],
    id: uuid.v4().toString(),
    playerID: "",
    startDate: new Date(),
  })

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    id: "",
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
    const initializePlayerData = async () => {
      const id = await getUserID()
      const name = await getUserName()
      setPlayer((prevPlayer) => ({ ...prevPlayer, id, name }))
      setPlayerGame((prevGame) => ({ ...prevGame, playerID: id }))
      setPlayerStats((prevStats) => ({ ...prevStats, id }))
    }
    initializePlayerData()
  }, [])

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
        await setUserName(user.displayName || "Guest")
        const result = await batchUpdatePlayerData(
          playerStats,
          { name: user.displayName },
          user.uid
        )
        if (result.success) console.log("Player data updated.")
      }
    }
    if (user) updatePlayerData()
  }, [user, player, playerStats])

  useEffect(() => {
    const updateStats = async () => {
      if (player.id) {
        const result = await batchUpdatePlayerData(
          playerStats,
          playerGame,
          player.id
        )
        if (result.success) {
          console.log("Player stats updated.")
        }
      }
    }
    if (playerStats) updateStats()
  }, [playerStats, player.id])

  useEffect(() => {
    const updateGame = async () => {
      if (player.id) {
        const result = await batchUpdatePlayerData(
          playerStats,
          playerGame,
          player.id
        )
        if (result.success) console.log("Player game data updated.")
      }
    }
    if (playerGame) updateGame()
  }, [playerGame, player.id])

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
                  updatePlayerStats={setPlayerStats}
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
