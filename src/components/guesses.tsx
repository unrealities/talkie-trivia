import React, { memo } from "react"
import { Text, View } from "react-native"
import Animated from "react-native-reanimated"
import { guessesStyles } from "../styles/guessesStyles"
import { useSkeletonAnimation } from "../utils/hooks/useSkeletonAnimation"
import { useGame } from "../contexts/gameContext"
import { BasicMovie } from "../models/movie"

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

const GuessesContainer = memo(() => {
  const { loading: isDataLoading, playerGame, movies } = useGame()
  const { guesses } = playerGame

  const getMovieTitle = (id: number | undefined) => {
    if (id && id > 0) {
      const movie = movies.find((m: BasicMovie) => m.id === id)
      const releaseYear = movie?.release_date ? ` (${movie.release_date})` : ""
      return movie ? `${movie.title}${releaseYear}` : "-"
    }
    return "-"
  }

  if (isDataLoading) {
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
})

export default GuessesContainer
