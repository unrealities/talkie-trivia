import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import * as Network from 'expo-network'
import { StatusBar } from 'expo-status-bar'
import * as WebBrowser from 'expo-web-browser'

import { initializeApp } from 'firebase/app'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'
import uuid from 'react-native-uuid'

import MoviesContainer from './src/components/movie'
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

export default function App() {
  const { user } = useAuthentication()

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

  const player = new Player()
  getUserID().then(id => {
    player.id = id
    player.name = ''
  })

  let pg: PlayerGame = {
    correctAnswer: false,
    endDate: new Date,
    game: game,
    guesses: [],
    id: uuid.v4().toString(),
    player: player,
    startDate: new Date,
  }

  let ps: PlayerStats = {
    currentStreak: 0,
    games: 1,
    maxStreak: 0,
    player: player,
    wins: [0, 0, 0, 0, 0]
  }

  const [playerGame, setPlayerGame] = useState<PlayerGame>(pg)
  const [playerStats, setPlayerStats] = useState<PlayerStats>(ps)
  const [isNetworkConnected, setIsNetworkConnected] = useState<boolean>(true)

  useEffect(() => {
    const networkConnected = async () => {
      try {
        await Network.getNetworkStateAsync().then((networkState) => {
          networkState.isInternetReachable ? setIsNetworkConnected(true) : setIsNetworkConnected(false)
          console.log(networkState.isConnected)
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
        setPlayerGame(pg)
        // TODO: Below seems like a hacky way to get this to a plain JS object
        await setDoc(doc(db, 'playerGames', playerGame.id), JSON.parse(JSON.stringify(playerGame)))
      } catch (e) {
        console.error("Error adding document: ", e)
      }
    }

    const updatePlayer = async () => {
      try {
        // TODO: Below seems like a hacky way to get this to a plain JS object
        await setDoc(doc(db, 'players', playerGame.player.id), JSON.parse(JSON.stringify(playerGame.player)))
      } catch (e) {
        console.error("Error adding document: ", e)
      }
    }

    // TODO: fetch playerStats
    const updatePlayerStats = async () => {
      try {
        const docRef = doc(db, 'playerStats', playerGame.player.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const dbPlayerStats = docSnap.data() as PlayerStats
          dbPlayerStats.games++
          setPlayerStats(dbPlayerStats)
        }
        // TODO: Below seems like a hacky way to get this to a plain JS object
        await setDoc(doc(db, 'playerStats', playerGame.player.id), JSON.parse(JSON.stringify(playerStats)))
      } catch (e) {
        console.error("Error adding document: ", e)
      }
    }

    updatePlayerStats()

    if (user) {
      pg.player.name = user?.displayName ? user.displayName.toString() : ''
      setPlayerGame(pg)
      updatePlayerGame()
      updatePlayer()
    } else {
      setPlayerGame(pg)
    }
  }, [user])

  return (
    <View style={styles.container}>
      <MoviesContainer
        isNetworkConnected={isNetworkConnected}
        movies={basicMovies}
        playerGame={playerGame}
        playerStats={playerStats}
        updatePlayerGame={setPlayerGame} />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  },
})
