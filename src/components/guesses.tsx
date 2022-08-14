import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppLoading from 'expo-app-loading';
import { BasicMovie, Movie } from './movie'
import { useFonts, Arvo_400Regular } from '@expo-google-fonts/arvo'

interface GuessesContainerProps {
    guesses: number[]
    movie: Movie
    movies: BasicMovie[]
}

const GuessesContainer = (props: GuessesContainerProps) => {
    let [fontsLoaded] = useFonts({ Arvo_400Regular })
    let getMovieTitle = (id: number) => {
        let movie = props.movies.find(m => m.id == id) as Movie
        return movie.title
    }
    let GuessesText: Element[] = []
    props.guesses.forEach((guess, i) => {
        GuessesText.push(<Text key={i} style={styles.text}>Guess {i + 1}: {getMovieTitle(guess)}</Text>)
    })

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {

        return (
            <View style={styles.container}>
                <>
                    {GuessesText}
                    {props.guesses.forEach(guess => {
                        if (guess == props.movie.id) {
                            console.log("correct. movie was: " + props.movie.title)
                        }
                        if (props.guesses.length >= 5) {
                            console.log("fail. movie was: " + props.movie.title)
                        }
                    })}
                </>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 1
    },
    text: {
        fontFamily: 'Arvo_400Regular',
        fontSize: 14
    },

});

export default GuessesContainer
