import React, { useState } from 'react'
import { Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Linking from 'expo-linking'
import { Picker } from '@react-native-picker/picker'
import CluesContainer from './clues'

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
  let movies: Movie[] = require('../../data/popularMovies.json')
  let randomMovieIndex = Math.floor(Math.random() * movies.length)
  let randomMovie = movies[randomMovieIndex] as Movie

  let displayActors = ""
  randomMovie.actors.forEach((actor) => {
    displayActors = displayActors + " | " + actor.name
  })

  const [movie] = useState(randomMovie)
  let imdbURI = 'https://www.imdb.com/title/'
  let imageURI = 'https://image.tmdb.org/t/p/original'


  // TODO: switch below hardcoded values to a list of movie titles populated from movies.json
  return (
    <View style={styles.container}>
      <MoviesPicker movieID={randomMovie.id} />
      <Text>{movie.title} ({movie.id})</Text>
      <Text>Release Date: {movie.release_date}</Text>
      <Text>Popularity: {movie.popularity}</Text>
      <Text>Vote Average: {movie.vote_average}</Text>
      <Text>Vote Count: {movie.vote_count}</Text>
      <Text>Tagline: {movie.tagline}</Text>
      <Text>Director: {movie.director.name}</Text>
      <Text>Actors: {displayActors}</Text>
      <TouchableOpacity onPress={() => { Linking.openURL(`${imdbURI}${movie.imdb_id}`) }}>
        <Text>IMDB Link: https://www.imdb.com/title/{movie.imdb_id}/</Text>
      </TouchableOpacity>
      <CluesContainer summary={movie.overview} />
      <Image
        source={{ uri: `${imageURI}${movie.poster_path}` }}
        style={{ width: '100%', height: '300px' }}
      />
    </View>
  )
}

interface MoviePickerProps {
  movieID: number
}

const MoviesPicker = (props:MoviePickerProps) => {
  let movies: Movie[] = require('../../data/popularMovies.json')
  const [selectedMovieID, setSelectedMovieID] = useState<number>(0)
  const [selectedMovieIndex, setSelectedMovieIndex] = useState<number>(0)
  const [guesses, setGuesses] = useState<number[]>([])
  let sortedMovies = movies.sort( function( a, b ) {
    return a.title < b.title ? -1 : a.title > b.title ? 1 : 0
  })

  let updateGuesses = () => {
    setGuesses([...guesses, selectedMovieID] )
  }

  return (
    <View>
      <Picker
        selectedValue={selectedMovieID}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedMovieID(itemValue)
          setSelectedMovieIndex(itemIndex)
        }}>
        { sortedMovies.map((movie) => (
          <Picker.Item label={movie.title} value={movie.id} />
        ))}
      </Picker>
      <Button
        onPress={() => updateGuesses()}
        title="Submit"
        color="#841584"
        accessibilityLabel="Submit your guess"
      />
      <Text>Selected Value: {selectedMovieID}</Text>
      <Text>Selected Index: {selectedMovieIndex}</Text>
      <Text>Guesses: {guesses}</Text>
      { guesses.forEach((guess) => {
        if (guess == props.movieID) {
          console.log("correct")
        }
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    justifyContent: 'center'
  },
});

export default MoviesContainer
