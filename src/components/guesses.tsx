import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BasicMovie, Movie } from './movie'
import { useFonts, Arvo_400Regular, Arvo_700Bold } from '@expo-google-fonts/arvo'

interface GuessesContainerProps {
    guesses: number[]
    movie: Movie
    movies: BasicMovie[]
}

const GuessesContainer = (props: GuessesContainerProps) => {
    let [fontsLoaded] = useFonts({ Arvo_400Regular, Arvo_700Bold })
    let getMovieTitle = (id: number) => {
        if (id > 0) {
            let movie = props.movies.find(m => m.id == id) as Movie
            return movie.title
        } else {
            return ''
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.guessContainer}>
                <Text style={styles.guessNumber}>1</Text>
                <Text style={styles.guess}>{getMovieTitle(props.guesses[0])}</Text>
            </View>
            <View style={styles.guessContainer}>
                <Text style={styles.guessNumber}>2</Text>
                <Text style={styles.guess}>{getMovieTitle(props.guesses[1])}</Text>
            </View>
            <View style={styles.guessContainer}>
                <Text style={styles.guessNumber}>3</Text>
                <Text style={styles.guess}>{getMovieTitle(props.guesses[2])}</Text>
            </View>
            <View style={styles.guessContainer}>
                <Text style={styles.guessNumber}>4</Text>
                <Text style={styles.guess}>{getMovieTitle(props.guesses[3])}</Text>
            </View>
            <View style={styles.guessContainer}>
                <Text style={styles.guessNumber}>5</Text>
                <Text style={styles.guess}>{getMovieTitle(props.guesses[4])}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '400'
    },
    guessContainer: {
        border: 2,
        borderColor: 'red',
        flex: 1,
        flexDirection: 'row',
        padding: 4,
        textAlign: 'left'
    },
    guessNumber: {
        alignSelf: 'flex-start',
        color: 'red',
        flex: 1,
        fontFamily: 'Arvo_700Bold',
        fontSize: 14,
        paddingRight: 20,
        textAlign: 'left'
    },
    guess: {
        fontFamily: 'Arvo_400Regular',
        fontSize: 14,
        textAlign: 'right'
    }
})

export default GuessesContainer
