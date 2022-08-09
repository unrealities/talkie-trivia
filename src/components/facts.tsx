import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import * as Linking from 'expo-linking'
import { Movie } from './movie'

interface FactsProps {
    movie: Movie
}

const Facts = (props: FactsProps) => {
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

export default Facts
