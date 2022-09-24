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

SplashScreen.preventAutoHideAsync()

export interface BasicMovie {
  id: number
  title: string
}

export interface Movie {
  actors: Actor[]
  director: Director
  id: number
  imdb_id: number
  overview: string
  poster_path: string
  popularity: number
  release_date: string
  tagline: string
  title: string
  vote_average: number
  vote_count: number
}

export interface Actor {
  id: number
  order: number
  name: string
  popularity: number
  profile_path: string
}

export interface Director {
  id: number
  name: string
  popularity: number
  profile_path: string
}

const MoviesContainer = () => {
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

  let basicMovies: BasicMovie[] = require('../../data/basicMovies.json')
  let movies: Movie[] = require('../../data/popularMovies.json')

  let newMovie = movies[Math.floor(Math.random() * movies.length)]

  const [correctGuess, setCorrectGuess] = useState<boolean>(false)
  const [enableSubmit, setEnableSubmit] = useState<boolean>(true)
  const [guesses, setGuesses] = useState<number[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [movie, setMovie] = useState<Movie>(newMovie)

  const confetti = useRef<ConfettiCannon>(null)

  useEffect(() => {
    if (guesses.length > 4) {
      setEnableSubmit(false)
    }
    if (correctGuess && showModal) {
      confetti.current?.start()
      setEnableSubmit(false)
    }
  })

  if (!fontsLoaded) { return null }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <TitleHeader />
      <CluesContainer
        correctGuess={correctGuess}
        guesses={guesses}
        summary={movie.overview} />
      <PickerContainer
        enableSubmit={enableSubmit}
        guesses={guesses}
        movieID={movie.id}
        movies={basicMovies}
        toggleModal={setShowModal}
        toggleSubmit={setEnableSubmit}
        updateCorrectGuess={setCorrectGuess}
        updateGuesses={setGuesses} />
      <GuessesContainer
        guesses={guesses}
        movie={movie}
        movies={basicMovies} />
      <MovieModal
        movie={movie}
        show={showModal}
        toggleModal={setShowModal} />
      <ResetContainer
        updateCorrectGuess={setCorrectGuess}
        updateGuesses={setGuesses}
        updateMovie={setMovie}
      />
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
    marginTop: 24,
    width: '90%'
  }
})

export default MoviesContainer
