import React, { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import ConfettiCannon from 'react-native-confetti-cannon'

import CluesContainer from './clues'
import GuessesContainer from './guesses'
import MovieModal from './modal'
import PickerContainer from './picker'

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
  let basicMovies: BasicMovie[] = require('../../data/basicMovies.json')
  let movies: Movie[] = require('../../data/popularMovies.json')

  const [guesses, setGuesses] = useState<number[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [movie] = useState<Movie>(movies[Math.floor(Math.random() * movies.length)])

  const confetti = useRef<ConfettiCannon>(null);
  guesses.forEach(guess => {
    if (guess == movie.id) {
      confetti.current?.start()
      // TODO: Infinite Loop
      // setShowModal(true)
    }
  })

  return (
    <View style={styles.container}>
      <CluesContainer summary={movie.overview} guesses={guesses} />
      <PickerContainer movieID={movie.id} movies={basicMovies} guesses={guesses} updateGuesses={setGuesses}/>
      <GuessesContainer guesses={guesses} movie={movie} movies={basicMovies} />
      <MovieModal show={showModal} movie={movie}/>
      <ConfettiCannon autoStart={false} count={100} fallSpeed={2000} origin={{x: -20, y: -20}} ref={confetti} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    justifyContent: 'center'
  }
})

export default MoviesContainer
