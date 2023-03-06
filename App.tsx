import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'

import { useFonts } from 'expo-font'
import * as Network from 'expo-network'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import * as WebBrowser from 'expo-web-browser'

import { initializeApp } from 'firebase/app'
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'
import uuid from 'react-native-uuid'

import GoogleLogin from './src/components/googleLogin'
import MoviesContainer from './src/components/movie'
import PlayerStatsContainer from './src/components/playerStats'
import Player from './src/models/player'
import PlayerStats from './src/models/playerStats'
import { BasicMovie, Movie } from './src/models/movie'
import { Game, PlayerGame } from './src/models/game'
import { colors } from './src/styles/global'
import { firebaseConfig } from './src/config/firebase'
import { useAuthentication } from './src/utils/hooks/useAuthentication'
import { getUserID } from './src/utils/hooks/localStore'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null)
WebBrowser.maybeCompleteAuthSession()

SplashScreen.preventAutoHideAsync()

export default function App() {
  const { user } = useAuthentication()

  let [fontsLoaded] = useFonts({
    'Arvo-Bold': require('./assets/fonts/Arvo-Bold.ttf'),
    'Arvo-Italic': require('./assets/fonts/Arvo-Italic.ttf'),
    'Arvo-Regular': require('./assets/fonts/Arvo-Regular.ttf')
  })
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  // init new movie
  let movies: Movie[] = require('./data/popularMovies.json')
  let basicMovies: BasicMovie[] = require('./data/basicMovies.json')
  let newMovie = movies[Math.floor(Math.random() * movies.length)]
  const [movie] = useState<Movie>(newMovie)

  // init new game
  // TODO: This should be initiated separately on a global level for all users
  let game: Game = {
    date: new Date,
    guessesMax: 5,
    id: uuid.v4().toString(),
    movie: movie
  }

  let p = new Player()

  let pg: PlayerGame = {
    correctAnswer: false,
    endDate: new Date,
    game: game,
    guesses: [],
    id: uuid.v4().toString(),
    playerID: p.id,
    startDate: new Date,
  }

  let ps: PlayerStats = {
    currentStreak: 0,
    games: 1,
    maxStreak: 0,
    player: p,
    wins: [0, 0, 0, 0, 0]
  }

  const [player, setPlayer] = useState<Player>(p)
  const [playerGame, setPlayerGame] = useState<PlayerGame>(pg)
  const [playerStats, setPlayerStats] = useState<PlayerStats>(ps)
  const [isNetworkConnected, setIsNetworkConnected] = useState<boolean>(true)

  useEffect(() => {
    const networkConnected = async () => {
      try {
        await Network.getNetworkStateAsync().then((networkState) => {
          networkState.isInternetReachable ? setIsNetworkConnected(true) : setIsNetworkConnected(false)
        })
      } catch (e) {
        console.error("No network connection")
      }
    }
    networkConnected()
  })

  useEffect(() => {
    const updatePlayerGame = async () => {
      try {
        // TODO: Below seems like a hacky way to get this to a plain JS object
        await setDoc(doc(db, 'playerGames', playerGame.id), JSON.parse(JSON.stringify(playerGame)))
      } catch (e) {
        console.error("Error adding document: ", e)
      }
    }

    const updatePlayer = async () => {
      try {
        getUserID().then(id => {
          p.id = id
          p.name = ''
        })
        // TODO: Below seems like a hacky way to get this to a plain JS object
        await setDoc(doc(db, 'players', player.id), JSON.parse(JSON.stringify(player)))
      } catch (e) {
        console.error("Error adding document: ", e)
      }
    }

    const updatePlayerStats = async () => {
      try {
        const docRef = doc(db, 'playerStats', player.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const dbPlayerStats = docSnap.data() as PlayerStats
          dbPlayerStats.games++
          setPlayerStats(dbPlayerStats)
          // TODO: Below seems like a hacky way to get this to a plain JS object
          await updateDoc(doc(db, 'playerStats', player.id), JSON.parse(JSON.stringify(playerStats)))
        } else {
          // TODO: Below seems like a hacky way to get this to a plain JS object
          await setDoc(doc(db, 'playerStats', player.id), JSON.parse(JSON.stringify(playerStats)))
        }
        
      } catch (e) {
        console.error("Error adding document: ", e)
      }
    }

    updatePlayerStats()

    if (user) {
      player.name = user?.displayName ? user.displayName.toString() : ''
      setPlayerGame(pg)
      updatePlayerGame()
      updatePlayer()
    } else {
      setPlayerGame(pg)
    }
  }, [user])

  const Tab = createBottomTabNavigator()

  function Game() {
    return (
      <View style={styles.container} onLayout={onLayoutRootView}>
        <MoviesContainer
          isNetworkConnected={isNetworkConnected}
          movies={basicMovies}
          player={player}
          playerGame={playerGame}
          playerStats={playerStats}
          updatePlayerGame={setPlayerGame} />
      </View>
    )
  }

  function Profile() {
    return (
      <View style={styles.container} onLayout={onLayoutRootView}>
        <GoogleLogin player={player} />
        <PlayerStatsContainer player={player} playerStats={playerStats} />
      </View>
    )
  }

  if (!fontsLoaded) { return null }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <StatusBar style="auto" />
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarIconStyle: {
          display: 'none'
        },
        tabBarInactiveTintColor: colors.tertiary,
        tabBarLabelStyle: {
          fontFamily: 'Arvo-Bold',
          fontSize: 16,
          paddingBottom: 8
        },
        tabBarStyle: {
          backgroundColor: colors.secondary,
          height: 80,
        }
      }}>
        <Tab.Screen
          name="Game"
          component={Game}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1
  }
})
