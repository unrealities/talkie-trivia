import React, { useEffect, useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as SecureStore from 'expo-secure-store'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { initializeApp } from 'firebase/app'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import uuid from 'react-native-uuid'

import GoogleLogin from './src/components/googleLogin'
import MoviesContainer from './src/components/movie'
import Player from './src/models/player'
import { BasicMovie, Movie } from './src/models/movie'
import { Game, PlayerGame } from './src/models/game'
import { colors } from './src/styles/global'
import { firebaseConfig } from './src/config/firebase'
import { useAuthentication } from './src/utils/hooks/useAuthentication'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const analytics = getAnalytics(app)
WebBrowser.maybeCompleteAuthSession()

const userID = 'userID'
const { user } = useAuthentication()

async function setUserID(id: string) {
  await SecureStore.setItemAsync(userID, id)
}

async function getUserID() {
  let id = await SecureStore.getItemAsync(userID)
  if (id) {
    return id
  } else {
    let newUserID = uuid.v4().toString()
    setUserID(newUserID)
    return newUserID
  }
}

export default function App() {
  // init new movie
  let movies: Movie[] = require('./data/popularMovies.json')
  let basicMovies: BasicMovie[] = require('./data/basicMovies.json')
  let newMovie = movies[Math.floor(Math.random() * movies.length)]

  // init new game
  // TODO: This should be initiated separately on a global level for all users
  let game: Game = {
    date: new Date,
    guessesMax: 5,
    id: uuid.v4().toString(),
    movie: newMovie
  }

  const [playerGame, setPlayerGame] = useState<PlayerGame>(pg)

  useEffect(() => {
    const updatePlayerGame = async () => {
      try {
        setPlayerGame(pg)
        // TODO: Below seems like a hacky way to get this to a plain JS object
        const docRef = await setDoc(doc(db, 'playerGames', playerGame.id), JSON.parse(JSON.stringify(playerGame)))
      } catch (e) {
        console.error("Error adding document: ", e)
      }
    }

    const updatePlayer = async () => {
      try {
        // TODO: Below seems like a hacky way to get this to a plain JS object
        const docRef = await setDoc(doc(db, 'players', playerGame.player.id), JSON.parse(JSON.stringify(playerGame.player)))
      } catch (e) {
        console.error("Error adding document: ", e)
      }
    }

    const player = new Player()
    player.id = getUserID()
    player.name = ''

    let pg: PlayerGame = {
      correctAnswer: false,
      endDate: new Date,
      game: game,
      guesses: [],
      id: uuid.v4().toString(),
      player: player,
      startDate: new Date,
    }

    // TODO: how to persist user information if already logged in?
    if (user) {
      pg.player.name = user?.displayName ? user.displayName.toString() : 'unknown'
      setPlayerGame(pg)
      updatePlayerGame()
      updatePlayer()
    } else {
      setPlayerGame(pg)
    }
  }, ['', user])

  return (
    <View style={styles.container}>
      <MoviesContainer movies={basicMovies} playerGame={playerGame} updatePlayerGame={setPlayerGame} />
      <GoogleLogin player={playerGame.player} />
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
