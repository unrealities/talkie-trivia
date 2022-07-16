import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Linking from 'expo-linking'
import { Picker } from '@react-native-picker/picker';
import CluesContainer from './clues'

import moviesData from '../../data/movies.json'
import creditsData from '../../data/credits.json'

export interface Movie {
  adult: boolean
  backdrop_path: string
  belongs_to_collection: any
  budget: number
  credits: Credits
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

export interface Credits {
  id: number
  cast: Cast[]
  crew: Crew[]
}

export interface Cast {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string
  cast_id: number
  character: string
  credit_id: string
  order: number
}

export interface Crew {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path?: string
  credit_id: string
  department: string
  job: string
}


const MoviesContainer = () => {
  const [selectedMovie, setSelectedMovie] = useState();
  // TODO: Unnecessary to load all this data into memory
  const movies: Movie[] = moviesData as Movie[]
  const credits: Credits[] = creditsData as Credits[]

  let randomMovieID = Math.floor(Math.random() * movies.length)
  let randomMovie: Movie = movies[randomMovieID]
  // while (randomMovie.overview.length > 350 || 
  //        randomMovie.overview.length < 60  ||
  //        randomMovie.runtime < 80 ||
  //        randomMovie.popularity < 40 ||
  //        randomMovie.vote_count < 100) {
  //   randomMovie = movies[randomMovieID]
  //   console.log(`overview length: ${randomMovie.overview.length}`)
  //   console.log(`runtime: ${randomMovie.runtime}`)
  //   console.log(`popularity: ${randomMovie.popularity}`)
  //   console.log(JSON.stringify(randomMovie))
  // }
  randomMovie.credits = credits[randomMovieID]
  console.log(JSON.stringify(randomMovie))

  let director = ""
  randomMovie.credits.crew.forEach((crew) => {
    if (crew.job == "Director") {
      director = crew.original_name
    }
  })
  let actors = [""]
  randomMovie.credits.cast.forEach((cast) => {
    actors[cast.order] = cast.name + "(" + cast.popularity + ")"
  })
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
