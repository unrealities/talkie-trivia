import React from 'react'
import { Text, View } from 'react-native'
import { BasicMovie, Movie } from './movie'

interface GuessesContainerProps {
    guesses: number[]
    movie: Movie
    movies: BasicMovie[]
}

const GuessesContainer = (props: GuessesContainerProps) => {
    let getMovieTitle = (id: number) => {
        let movie = props.movies.find(m => m.id == id) as Movie
        return movie.title
    }
    let GuessesText: Element[] = []
    props.guesses.forEach((guess, i) => {
        GuessesText.push(<Text key={i}>Guess {i + 1}: {getMovieTitle(guess)}</Text>)
    })

    return (
        <View>
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

export default GuessesContainer
