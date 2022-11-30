import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import uuid from 'react-native-uuid'

import { colors } from '../styles/global'
import { Movie } from '../models/movie'

export interface ResetContainerProps {
    updatePlayerGame: SetStateAction
}

export const ResetContainer = (props: ResetContainerProps) => {
    let movies: Movie[] = require('../../data/popularMovies.json')

    let newMovie = movies[Math.floor(Math.random() * movies.length)]

    // init new game
    // TODO: This should be initiated separately on a global level for all users
    let game: Game = {
      date: new Date,
      guessesMax: 5,
      id: uuid.v4().toString(),
      movie: newMovie
    } 
    // TODO: pass in player here
    let playerGame: PlayerGame = {
      correctAnswer: false,
      endDate: new Date,
      game: game,
      guesses: [],
      startDate: new Date, 
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={() => {
                props.updatePlayerGame(playerGame)
            }}>
                <Text style={styles.text}>Play Again?</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        justifyContent: 'center'
    },
    text: {
        color: colors.secondary,
        flex: 1,
        fontFamily: 'Arvo-Italic',
        fontSize: 20
    }
})
