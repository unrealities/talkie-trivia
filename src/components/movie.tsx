import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import ConfettiCannon from 'react-native-confetti-cannon'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import CluesContainer from './clues'
import GuessesContainer from './guesses'
import MovieModal from './modal'
import PickerContainer from './picker'
import TitleHeader from './titleHeader'
import { ResetContainer } from './reset'
import { BasicMovie, Movie } from '../models/movie'
import { PlayerGame } from '../models/game'

SplashScreen.preventAutoHideAsync()

interface MovieContainerProps {
  movies: BasicMovie[]
  playerGame: PlayerGame
}

const MoviesContainer = (props: MovieContainerProps) => {
  let [fontsLoaded] = useFonts({
    'Arvo-Bold': require('../../assets/fonts/Arvo-Bold.ttf'),
    'Arvo-Italic': require('../../assets/fonts/Arvo-Italic.ttf'),
    'Arvo-Regular': require('../../assets/fonts/Arvo-Regular.ttf')
  })
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  const [playerGame, setPlayerGame] = useState<PlayerGame>(props.playerGame)
  const [enableSubmit, setEnableSubmit] = useState<boolean>(!playerGame.correctAnswer)
  const [showModal, setShowModal] = useState<boolean>(false)

  const confetti = useRef<ConfettiCannon>(null)

  useEffect(() => {
    if (playerGame.guesses.length > 4) {
      setEnableSubmit(false)
    }
    if (playerGame.correctAnswer && showModal) {
      confetti.current?.start()
      setEnableSubmit(false)
    }
  })

  if (!fontsLoaded) { return null }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <TitleHeader />
      <CluesContainer
        correctGuess={playerGame.correctAnswer}
        guesses={playerGame.guesses}
        summary={playerGame.game.movie.overview} />
      <PickerContainer
        enableSubmit={enableSubmit}
        playerGame={playerGame}
        movies={props.movies}
        toggleModal={setShowModal}
        toggleSubmit={setEnableSubmit}
        updatePlayerGame={setPlayerGame} />
      <GuessesContainer
        guesses={playerGame.guesses}
        movie={playerGame.game.movie}
        movies={props.movies} />
      <MovieModal
        movie={playerGame.game.movie}
        show={showModal}
        toggleModal={setShowModal} />
      <ResetContainer
        playerGame={playerGame}
        updatePlayerGame={setPlayerGame} />
      <ConfettiCannon
        autoStart={false}
        count={100}
        fadeOut={true}
        fallSpeed={2000}
        origin={{ x: -100, y: -20 }}
        ref={confetti} />
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
