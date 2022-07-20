import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Linking from 'expo-linking'
import { Picker } from '@react-native-picker/picker'
import CluesContainer from './clues'

import moviesData from '../../data/popularMovies.json'

export interface Movies {
  id: Movie
}

export interface Movie {
  actors: Actor[]
  director: Director
  id: number
  overview: string
  poster_path: string
  release_date: string
  tagline: string
  title: string
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
  const [selectedMovie, setSelectedMovie] = useState()
  // TODO: access moviesData

  let randomMovieID = Math.floor(Math.random() * movies.length)
  let randomMovie: Movie = movies[randomMovieID]

  console.log(JSON.stringify(randomMovie))

  let displayActors = ""
  actors.forEach((actor) => {
    displayActors = displayActors + " | " + actor
  })

  const [movie] = useState(randomMovie)
  let imdbURI = 'https://www.imdb.com/title/'
  let imageURI = 'https://image.tmdb.org/t/p/original'


  // TODO: switch below hardcoded values to a list of movie titles populated from movies.json
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedMovie}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedMovie(itemValue)
        }>
        <Picker.Item label="Office Space" value="1234" />
        <Picker.Item label="Back to the Future" value="5678" />
      </Picker>
      <Text>{movie.title} ({movie.id}) ({movie.popularity})</Text>
      <Text>{movie.tagline}</Text>
      <Text>{movie.release_date}</Text>
      <Text>Director: {director}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    justifyContent: 'center'
  },
});

export default MoviesContainer
