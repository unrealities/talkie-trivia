import React, { useState } from 'react'
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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

  const [guesses, setGuesses] = useState<number[]>([])
  const [movie] = useState(randomMovie)

  return (
    <View style={styles.container}>
      <CluesContainer summary={movie.overview} guesses={guesses} />
      <MoviesPicker movieID={movie.id} guesses={guesses} updateGuesses={setGuesses}/>
      <Text>Guesses: {guesses}</Text>
      {guesses.forEach((guess) => {
        if (guess == movie.id) {
          console.log("correct")
        }
      })}
      {/*<MovieFacts movie={randomMovie} />*/}
    </View>
  )
}

interface MoviePickerProps {
  guesses: number[]
  movieID: number
  updateGuesses: Dispatch<SetStateAction<number[]>>
}

interface MovieFactsProps {
  movie: Movie
}

const MoviesPicker = (props: MoviePickerProps) => {
  let movies: Movie[] = require('../../data/popularMovies.json')
  const [selectedMovieID, setSelectedMovieID] = useState<number>(0)
  const [selectedMovieIndex, setSelectedMovieIndex] = useState<number>(0)
  let sortedMovies = movies.sort(function (a, b) {
    return a.title < b.title ? -1 : a.title > b.title ? 1 : 0
  })

  return (
    <View>
      <Picker
        selectedValue={selectedMovieID}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedMovieID(itemValue)
          setSelectedMovieIndex(itemIndex)
        }}>
        {sortedMovies.map((movie) => (
          <Picker.Item label={movie.title} value={movie.id} />
        ))}
      </Picker>
      <Button
        onPress={() => props.updateGuesses([...props.guesses, selectedMovieID])}
        title="Submit"
        color="red"
        accessibilityLabel="Submit your guess"
      />
      <Text>Selected Value: {selectedMovieID}</Text>
      <Text>Selected Index: {selectedMovieIndex}</Text>
    </View>
  )
}

const MovieFacts = (props: MovieFactsProps) => {
  let imdbURI = 'https://www.imdb.com/title/'
  let imageURI = 'https://image.tmdb.org/t/p/original'
  let movie = props.movie

  let displayActors = ""
  movie.actors.forEach((actor) => {
    displayActors = displayActors + " | " + actor.name
  })

  return (
    <View>
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
      <Image
        source={{ uri: `${imageURI}${movie.poster_path}` }}
        style={{ width: '200px', height: '300px' }}
      />
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
