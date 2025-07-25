import React, { memo, useEffect } from "react"
import { Text, View } from "react-native"
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { guessesStyles } from "../styles/guessesStyles"
import { useSkeletonAnimation } from "../utils/hooks/useSkeletonAnimation"
import { useGame } from "../contexts/gameContext"
import { BasicMovie } from "../models/movie"
import { colors } from "../styles/global"

type GuessResult = { movieId: number; correct: boolean } | null

interface GuessRowProps {
  index: number
  guessId: number | undefined
  movies: readonly BasicMovie[]
  isLastGuess: boolean
  lastGuessResult: GuessResult
}

const GuessRow = memo(
  ({ index, guessId, movies, isLastGuess, lastGuessResult }: GuessRowProps) => {
    const opacity = useSharedValue(0)
    const translateY = useSharedValue(20)
    const shakeX = useSharedValue(0)
    const backgroundColor = useSharedValue(colors.grey)

    const getMovieTitle = (id: number | undefined) => {
      if (id && id > 0) {
        const movie = movies.find((m: BasicMovie) => m.id === id)
        return movie?.title
      }
      return "-"
    }
    const guessTitle = getMovieTitle(guessId)

    const animatedContainerStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { translateX: shakeX.value },
      ],
      backgroundColor: backgroundColor.value,
    }))

    useEffect(() => {
      // Animate entry
      opacity.value = withTiming(1, { duration: 300 })
      translateY.value = withTiming(0, { duration: 300 })

      if (isLastGuess && lastGuessResult) {
        if (lastGuessResult.correct) {
          // Correct guess: flash green
          backgroundColor.value = withSequence(
            withTiming(colors.quinary, { duration: 400 }),
            withDelay(1000, withTiming(colors.grey, { duration: 500 }))
          )
        } else {
          // Incorrect guess: shake
          shakeX.value = withSequence(
            withTiming(-10, { duration: 70 }),
            withRepeat(withTiming(10, { duration: 140 }), 3, true),
            withTiming(0, { duration: 70 })
          )
          // And flash red
          backgroundColor.value = withSequence(
            withTiming(colors.quaternary, { duration: 200 }),
            withDelay(800, withTiming(colors.grey, { duration: 500 }))
          )
        }
      }
    }, [isLastGuess, lastGuessResult])

    return (
      <View style={guessesStyles.guessRow}>
        <Animated.View
          style={[guessesStyles.guessContainer, animatedContainerStyle]}
        >
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
        </Animated.View>
      </View>
    )
  }
)

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
  ({ lastGuessResult }: { lastGuessResult: GuessResult }) => {
    const { loading: isDataLoading, playerGame, movies } = useGame()
    const { guesses, guessesMax } = playerGame

    if (isDataLoading) {
      return (
        <View style={guessesStyles.container}>
          {Array.from({ length: guessesMax }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </View>
      )
    }

    return (
      <View style={guessesStyles.container}>
        {Array.from({ length: guessesMax }).map((_, index) => {
          const guessId = guesses[index]
          const isLastGuess =
            !!lastGuessResult &&
            index === guesses.length - 1 &&
            lastGuessResult.movieId === guessId

          if (!guessId) {
            return (
              <View key={index} style={guessesStyles.guessContainer}>
                <Text style={guessesStyles.guessNumber}>{index + 1}</Text>
                <Text style={guessesStyles.guess}>-</Text>
              </View>
            )
          }

          return (
            <GuessRow
              key={`${guessId}-${index}`}
              index={index}
              guessId={guessId}
              movies={movies}
              isLastGuess={isLastGuess}
              lastGuessResult={lastGuessResult}
            />
          )
        })}
      </View>
    )
  }
)

export default GuessesContainer
