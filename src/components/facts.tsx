import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Linking from 'expo-linking'
import Actors from './actors'
import Genres from './genres'
import { Movie } from '../models/movie'

interface FactsProps {
    movie: Movie
}

const Facts = (props: FactsProps) => {
    let imdbURI = 'https://www.imdb.com/title/'
    let imageURI = 'https://image.tmdb.org/t/p/original'
    let movie = props.movie

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { Linking.openURL(`${imdbURI}${movie.imdb_id}`) }}>
                <Text style={styles.header}>{movie.title}</Text>
            </TouchableOpacity>
            <Text style={styles.subHeader}>{movie.tagline}</Text>
            <Image
                source={{ uri: `${imageURI}${movie.poster_path}` }}
                style={{ width: 200, height: 300 }}
            />
            <Text style={styles.text}>Directed by {movie.director.name}</Text>
            <Actors actors={movie.actors} />
            <Genres genres={movie.genres} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        paddingBottom: 20,
        width: 320
    },
    header: {
        flexWrap: 'wrap',
        fontFamily: 'Arvo-Bold',
        fontSize: 24,
        paddingBottom: 6,
        textAlign: 'center'
    },
    subHeader: {
        flexWrap: 'wrap',
        fontFamily: 'Arvo-Italic',
        fontSize: 14,
        paddingBottom: 20,
        textAlign: 'center'
    },
    text: {
        flexWrap: 'wrap',
        fontFamily: 'Arvo-Regular',
        fontSize: 14,
        paddingTop: 20,
        textAlign: 'center'
    }
})

export default Facts
