// src/components/guesses.tsx
import React, { useEffect } from "react" // Import useEffect
import { Text, View } from "react-native"
import { BasicMovie, Movie } from "../models/movie"
import { guessesStyles } from "../styles/guessesStyles"

interface GuessesContainerProps {
  guesses: number[]
  movie: Movie
  movies: BasicMovie[]
}

const GuessesContainer = ({ guesses, movies }: GuessesContainerProps) => {
  // Add useEffect to log when guesses are updated
  useEffect(() => {
    console.log("GuessesContainer: Guesses updated:", guesses)
  }, [guesses])

  const getMovieTitle = (id: number | undefined) => {
    if (id && id > 0) {
      const movie = movies.find((m) => m.id === id)
      const releaseYear = movie?.release_date
        ? ` (${movie.release_date.toString().substring(0, 4)})`
        : ""
      return movie ? `${movie.title}${releaseYear}` : "-"
    }
    return "-"
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
              style={[
                guessesStyles.guess,
                guessTitle.length > 35 && guessesStyles.guessSmall, // Apply smaller font size if title is long
              ]}
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
