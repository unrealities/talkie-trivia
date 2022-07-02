import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Linking from 'expo-linking'
import CluesContainer from './clues'

import data from '../../data/movies.json'

export interface Movie {
  adult: boolean
  backdrop_path: string
  belongs_to_collection: any
  budget: number
  genres: Genre[]
  homepage: string
  id: number
  imdb_id: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  release_date: string
  revenue: number
  runtime: number
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  logo_path: string
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

const MoviesContainer = () => {
  const movies: Movie[] = data as Movie[]
  let randomMovie: Movie = movies[Math.floor(Math.random() * movies.length)]
  while (randomMovie.overview.length > 350 || 
         randomMovie.overview.length < 60  ||
         randomMovie.runtime < 80 ||
         randomMovie.popularity < 40 ||
         randomMovie.vote_count < 100) {
    randomMovie = movies[Math.floor(Math.random() * movies.length)]
    console.log(`overview length: ${randomMovie.overview.length}`)
    console.log(`runtime: ${randomMovie.runtime}`)
    console.log(`popularity: ${randomMovie.popularity}`)
    console.log(JSON.stringify(randomMovie))
  }
  console.log(JSON.stringify(randomMovie))
  const [movie] = useState(randomMovie)
  let imdbURI = 'https://www.imdb.com/title/'
  let imageURI = 'https://image.tmdb.org/t/p/original'

  return (
    <View style={styles.container}>
      <Text>{movie.title} ({movie.id}) ({movie.popularity})</Text>
      <Text>{movie.tagline}</Text>
      <Text>{movie.release_date}</Text>
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
