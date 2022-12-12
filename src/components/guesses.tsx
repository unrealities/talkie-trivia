import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BasicMovie, Movie } from '../models/movie'

import { colors } from '../styles/global'

interface GuessesContainerProps {
    guesses: number[]
    movie: Movie
    movies: BasicMovie[]
}

const GuessesContainer = (props: GuessesContainerProps) => {
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
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.guess}>{getMovieTitle(props.guesses[0])}</Text>
            </View>
            <View style={styles.guessContainer}>
                <Text style={styles.guessNumber}>2</Text>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.guess}>{getMovieTitle(props.guesses[1])}</Text>
            </View>
            <View style={styles.guessContainer}>
                <Text style={styles.guessNumber}>3</Text>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.guess}>{getMovieTitle(props.guesses[2])}</Text>
            </View>
            <View style={styles.guessContainer}>
                <Text style={styles.guessNumber}>4</Text>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.guess}>{getMovieTitle(props.guesses[3])}</Text>
            </View>
            <View style={styles.guessContainer}>
                <Text style={styles.guessNumber}>5</Text>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.guess}>{getMovieTitle(props.guesses[4])}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxHeight: 140,
        minWidth: 280,
        width: 280
    },
    guessContainer: {
        flex: 1,
        flexDirection: 'row',
        minHeight: 20,
        textAlign: 'left',
        width: 260
    },
    guessNumber: {
        alignSelf: 'flex-start',
        color: colors.primary,
        flex: 1,
        fontFamily: 'Arvo-Bold',
        fontSize: 14,
        maxWidth: 40,
        paddingRight: 20,
        textAlign: 'right'
    },
    guess: {
        color: colors.secondary,
        flex: 1,
        fontFamily: 'Arvo-Regular',
        fontSize: 14,
        textAlign: 'center'
    }
})

export default GuessesContainer
