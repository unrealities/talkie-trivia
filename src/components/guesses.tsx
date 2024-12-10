import React from "react"
import { Text, View } from "react-native"
import { BasicMovie, Movie } from "../models/movie"
import { guessesStyles } from "../styles/guessesStyles"

interface GuessesContainerProps {
  guesses: number[]
  movie: Movie
  movies: BasicMovie[]
}

const GuessesContainer = ({ guesses, movies }: GuessesContainerProps) => {
  const getMovieTitle = (id: number | undefined) => {
    if (id && id > 0) {
      const movie = movies.find((m) => m.id === id)
      return movie ? movie.title : ""
    }
    return ""
  }

  return (
    <View style={guessesStyles.container}>
      {Array.from({ length: 5 }).map((_, index) => {
        const guessId = guesses[index]
        const guessTitle = getMovieTitle(guessId) || "-"

        return (
          <View key={index} style={guessesStyles.guessContainer}>
            <Text style={guessesStyles.guessNumber}>{index + 1}</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={guessesStyles.guess}
            >
              {guessTitle}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

export default GuessesContainer
