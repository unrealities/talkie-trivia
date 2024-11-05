import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View, Text, ActivityIndicator, Button } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import * as Network from 'expo-network'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import uuid from 'react-native-uuid'
import { useAuthentication } from './src/utils/hooks/useAuthentication'
import { getUserID, getUserName, setUserName } from './src/utils/hooks/localStore'
import { colors } from './src/styles/global'
import { firebaseConfig } from './src/config/firebase'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { updatePlayer, updatePlayerGame, updatePlayerStats } from './src/utils/firebaseService'

import GoogleLogin from './src/components/googleLogin'
import MoviesContainer from './src/components/movie'
import PlayerStatsContainer from './src/components/playerStats'
import { Game, Player, PlayerGame, PlayerStats } from './src/models'
import movies from './data/popularMovies.json'

initializeApp(firebaseConfig)
const db = getFirestore()

SplashScreen.preventAutoHideAsync()

const App = () => {
  const { user } = useAuthentication()
  const [isAppReady, setIsAppReady] = useState(false)
  const [isNetworkConnected, setIsNetworkConnected] = useState(true)
  const [loadingError, setLoadingError] = useState(null)
  const [player, setPlayer] = useState<Player>({ id: uuid.v4().toString(), name: '' })
  
  const [movie, setMovie] = useState<Movie>(movies[new Date().getDate() % movies.length])
  const [playerGame, setPlayerGame] = useState<PlayerGame>({ /* initial PlayerGame values */ })
  const [playerStats, setPlayerStats] = useState<PlayerStats>({ /* initial PlayerStats values */ })

  let [fontsLoaded] = useFonts({
    'Arvo-Bold': require('./assets/fonts/Arvo-Bold.ttf'),
    'Arvo-Regular': require('./assets/fonts/Arvo-Regular.ttf'),
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
    const updateData = async () => {
      if (user) {
        player.name = user?.displayName ?? ''
      }
      const updatedStats = await updatePlayerStats(playerStats, player.id)
      if (updatedStats) setPlayerStats(updatedStats)
      await updatePlayer(player, getUserID, getUserName, setUserName)
      await updatePlayerGame(playerGame)
    }
    updateData()
  }, [player, playerGame, playerStats, user])

  const Tab = createBottomTabNavigator()

  if (!isNetworkConnected) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No Internet Connection</Text>
        <Button title="Retry" onPress={retryLoadResources} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {isAppReady ? (
        <Tab.Navigator screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarLabelStyle: { fontFamily: 'Arvo-Bold', fontSize: 16 },
        }}>
          <Tab.Screen name="Game" component={() => (
            <View style={styles.container}>
              <MoviesContainer player={player} playerGame={playerGame} playerStats={playerStats} />
            </View>
          )} />
          <Tab.Screen name="Profile" component={() => (
            <View style={styles.container}>
              <GoogleLogin player={player} />
              <PlayerStatsContainer player={player} playerStats={playerStats} />
            </View>
          )} />
        </Tab.Navigator>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontFamily: 'Arvo-Regular',
    fontSize: 20,
    color: 'red',
  },
})

export default App
