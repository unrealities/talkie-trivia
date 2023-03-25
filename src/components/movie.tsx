import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import ConfettiCannon from 'react-native-confetti-cannon'
import { initializeApp } from 'firebase/app'
import { doc, getFirestore, setDoc } from 'firebase/firestore'

import CluesContainer from './clues'
import GuessesContainer from './guesses'
import NetworkContainer from './network'
import MovieModal from './modal'
import PickerContainer from './picker'
import TitleHeader from './titleHeader'
import ResetContainer from './reset'
import { BasicMovie } from '../models/movie'
import { PlayerGame } from '../models/game'
import Player from '../models/player'
import PlayerStats from '../models/playerStats'
import { firebaseConfig } from '../config/firebase'
import { playerStatsConverter } from '../utils/firestore/converters/playerStats'
import { playerGameConverter } from '../utils/firestore/converters/playerGame'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface MovieContainerProps {
  isNetworkConnected: boolean
  movies: BasicMovie[]
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats
  updatePlayerGame: Dispatch<SetStateAction<PlayerGame>>
}

const MoviesContainer = (props: MovieContainerProps) => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [enableSubmit, setEnableSubmit] = useState<boolean>(!props.playerGame.correctAnswer)
  const [showModal, setShowModal] = useState<boolean>(false)

  const confettiRef = useRef<ConfettiCannon>(null)

  useEffect(() => {
    const setPlayerGame = async (playerGame: PlayerGame) => {
      console.log(playerGame)
      try {
        await setDoc(doc(db, 'playerGames', playerGame.id).withConverter(playerGameConverter), playerGame)
      } catch (e) {
        console.error("Error adding document: ", e)
      }
    }

    const setPlayerStats = async (correctAnswer: boolean) => {
      let ps = props.playerStats

      if (correctAnswer) {
        ps.currentStreak++
        if (ps.currentStreak > ps.maxStreak) {
          ps.maxStreak = ps.currentStreak
        }
        ps.wins[props.playerGame.guesses.length]++
      } else {
        ps.currentStreak = 0
      }

      try {
        await setDoc(doc(db, 'playerStats', props.player.id).withConverter(playerStatsConverter), ps)
      } catch (e) {
        console.error("Error adding document: ", e)
      }
    }

    if (props.playerGame.guesses.length > 4) {
      console.log('game over. no correct answer')
      setEnableSubmit(false)
      setPlayerStats(false)
      setShowModal(true)
    }
    if (props.playerGame.correctAnswer) {
      console.log('game over. correct answer.')
      confettiRef?.current?.start()
      setEnableSubmit(false)
      setPlayerStats(true)
      setShowModal(true)
    }

    if (props.player.name != '') {
      setPlayerGame(props.playerGame)
    }

    setLoading(false)
  }, [props.playerGame])

  if (isLoading) { return null }

  return (
    <View style={styles.container}>
      <NetworkContainer isConnected={props.isNetworkConnected} />
      <TitleHeader />
      <CluesContainer
        correctGuess={props.playerGame.correctAnswer}
        guesses={props.playerGame.guesses}
        summary={props.playerGame.game.movie.overview} />
      <PickerContainer
        enableSubmit={enableSubmit}
        playerGame={props.playerGame}
        movies={props.movies}
        toggleModal={setShowModal}
        toggleSubmit={setEnableSubmit}
        updatePlayerGame={props.updatePlayerGame} />
      <GuessesContainer
        guesses={props.playerGame.guesses}
        movie={props.playerGame.game.movie}
        movies={props.movies} />
      <ResetContainer
        playerGame={props.playerGame}
        updatePlayerGame={props.updatePlayerGame} />
      <MovieModal
        movie={props.playerGame.game.movie}
        show={showModal}
        toggleModal={setShowModal} />
      <ConfettiCannon
        autoStart={false}
        count={250}
        //fadeOut={true}
        fallSpeed={2000}
        origin={{ x: 100, y: -20 }}
        ref={confettiRef} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    marginTop: 24,
    width: '90%'
  }
})

export default MoviesContainer
