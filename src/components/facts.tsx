import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.subHeader}>{movie.tagline}</Text>
                <Genres genres={movie.genres} />
                <Image
                    source={{ uri: `${imageURI}${movie.poster_path}` }}
                    style={{ width: '60%', height: '40%' }}
                />
                <Text style={styles.text}>Directed by {movie.director.name}</Text>
                <Actors actors={movie.actors} />
            </ScrollView>
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
    scrollContainer: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        paddingBottom: 20,
        width: 320
    },
    subHeader: {
        flexWrap: 'wrap',
        fontFamily: 'Arvo-Italic',
        fontSize: 14,
        textAlign: 'center'
    },
    text: {
        flexWrap: 'wrap',
        fontFamily: 'Arvo-Regular',
        fontSize: 14,
        paddingTop: 10,
        textAlign: 'center'
    }
})

export default Facts
