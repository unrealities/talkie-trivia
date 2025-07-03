import React, { memo } from "react"
import { Text, View } from "react-native"
import Animated from "react-native-reanimated"
import { BasicMovie, Movie } from "../models/movie"
import { guessesStyles } from "../styles/guessesStyles"
import { useSkeletonAnimation } from "../utils/hooks/useSkeletonAnimation"

interface GuessesContainerProps {
  isLoading: boolean
  guesses: number[]
  movie: Movie
  movies: readonly BasicMovie[]
}

const SkeletonRow = memo(() => {
  const animatedStyle = useSkeletonAnimation()
  return (
    <Animated.View style={[guessesStyles.skeletonRow, animatedStyle]}>
      <Text style={guessesStyles.guessNumber}>-</Text>
      <View style={guessesStyles.skeletonTextContainer}>
        <View style={guessesStyles.skeletonText} />
      </View>
    </Animated.View>
  )
})

const GuessesContainer = memo(
  ({ isLoading, guesses, movies }: GuessesContainerProps) => {
    const getMovieTitle = (id: number | undefined) => {
      if (id && id > 0) {
        const movie = movies.find((m) => m.id === id)
        const releaseYear = movie?.release_date
          ? ` (${movie.release_date})`
          : ""
        return movie ? `${movie.title}${releaseYear}` : "-"
      }
      return "-"
    }

    if (isLoading) {
      return (
        <View style={guessesStyles.container}>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </View>
      )
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
                  guessTitle.length > 35 && guessesStyles.guessSmall,
                ]}
              >
                {guessTitle}
              </Text>
            </View>
          )
        })}
      </View>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isLoading === nextProps.isLoading &&
      JSON.stringify(prevProps.guesses) === JSON.stringify(nextProps.guesses) &&
      prevProps.movie === nextProps.movie &&
      prevProps.movies === nextProps.movies
    )
  }
)

export default GuessesContainer
