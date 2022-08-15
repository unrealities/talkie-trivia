import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Linking from 'expo-linking'
import AppLoading from 'expo-app-loading'
import { Movie } from './movie'
import { useFonts, Arvo_700Bold, Arvo_400Regular, Arvo_400Regular_Italic } from '@expo-google-fonts/arvo'

interface FactsProps {
    movie: Movie
}

const Facts = (props: FactsProps) => {
    let [fontsLoaded] = useFonts({ Arvo_700Bold, Arvo_400Regular, Arvo_400Regular_Italic })

    let imdbURI = 'https://www.imdb.com/title/'
    let imageURI = 'https://image.tmdb.org/t/p/original'
    let movie = props.movie

    let displayActors = ""
    movie.actors.forEach((actor) => {
        displayActors = displayActors + " | " + actor.name
    })

    if (!fontsLoaded) {
        return <AppLoading />
    } else {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => { Linking.openURL(`${imdbURI}${movie.imdb_id}`) }}>
                    <Text style={styles.header}>{movie.title}</Text>
                </TouchableOpacity>
                <Text style={styles.subHeader}>{movie.tagline}</Text>
                <Image
                    source={{ uri: `${imageURI}${movie.poster_path}` }}
                    style={{ width: '200px', height: '300px' }}
                />
                <Text style={styles.text}>Directed by {movie.director.name}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 20,
        width: '320px'
    },
    header: {
        flexWrap: 'wrap',
        fontFamily: 'Arvo_700Bold',
        fontSize: 24,
        paddingBottom: 6,
        textAlign: 'center'
    },
    subHeader: {
        flexWrap: 'wrap',
        fontFamily: 'Arvo_400Regular_Italic',
        fontSize: 14,
        textAlign: 'center'
    },
    text: {
        flexWrap: 'wrap',
        fontFamily: 'Arvo_400Regular',
        fontSize: 14,
        textAlign: 'center'
    }
})

export default Facts
