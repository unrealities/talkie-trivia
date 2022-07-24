import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
      <MoviesPicker />
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

const MoviesPicker = () => {
  let movies: Movie[] = require('../../data/popularMovies.json')
  const [selectedMovie, setSelectedMovie] = useState()
  let sortedMovies = movies.sort( function( a, b ) {
    return a.title < b.title ? -1 : a.title > b.title ? 1 : 0
  })

  return (
    <Picker
      selectedValue={selectedMovie}
      onValueChange={(itemValue, itemIndex) =>
        setSelectedMovie(itemValue)
      }>
      { sortedMovies.map((movie) => (
        <Picker.Item label={movie.title + ' (' + movie.popularity + ')' + ' (' + movie.vote_average + ')' + ' (' + movie.vote_count + ')'}  value={movie.id} />
      ))}
    </Picker>
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
