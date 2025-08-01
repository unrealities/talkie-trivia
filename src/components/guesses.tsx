import React, { memo, useEffect } from "react"
import { Text, View } from "react-native"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import Icon from "react-native-vector-icons/FontAwesome"

import { guessesStyles } from "../styles/guessesStyles"
import { useSkeletonAnimation } from "../utils/hooks/useSkeletonAnimation"
import { useGame } from "../contexts/gameContext"
import { BasicMovie } from "../models/movie"
import { colors } from "../styles/global"

type GuessResult = { movieId: number; correct: boolean } | null

interface GuessRowProps {
  index: number
  guessId: number
  movies: readonly BasicMovie[]
  isLastGuess: boolean
  lastGuessResult: GuessResult
}

const GuessRow = memo(
  ({ index, guessId, movies, isLastGuess, lastGuessResult }: GuessRowProps) => {
    const rotate = useSharedValue(0)
    const shakeX = useSharedValue(0)
    const backgroundColor = useSharedValue(colors.surface)

    const guessTitle =
      movies.find((m: BasicMovie) => m.id === guessId)?.title || "Unknown Movie"
    const isCorrect = lastGuessResult?.correct === true

    const animatedTileStyle = useAnimatedStyle(() => {
      const rotateY = interpolate(rotate.value, [0, 1], [180, 360])
      return {
        backgroundColor: backgroundColor.value,
        transform: [
          { perspective: 1000 },
          { rotateY: `${rotateY}deg` },
          { translateX: shakeX.value },
        ],
      }
    })

    const animatedContentStyle = useAnimatedStyle(() => ({
      opacity: rotate.value,
    }))

    useEffect(() => {
      rotate.value = withTiming(1, { duration: 600 })

      if (isLastGuess && lastGuessResult) {
        if (isCorrect) {
          backgroundColor.value = withSequence(
            withDelay(600, withTiming(colors.success, { duration: 400 })),
            withDelay(1000, withTiming(colors.surface, { duration: 500 }))
          )
        } else {
          shakeX.value = withSequence(
            withDelay(700, withTiming(-10, { duration: 70 })),
            withTiming(10, { duration: 140 }),
            withTiming(-10, { duration: 140 }),
            withTiming(10, { duration: 140 }),
            withTiming(0, { duration: 70 })
          )
          backgroundColor.value = withSequence(
            withDelay(600, withTiming(colors.error, { duration: 400 })),
            withDelay(1000, withTiming(colors.surface, { duration: 500 }))
          )
        }
      }
    }, [isLastGuess, lastGuessResult, isCorrect])

    return (
      <Animated.View style={[guessesStyles.guessTile, animatedTileStyle]}>
        <Animated.View
          style={[
            guessesStyles.container,
            animatedContentStyle,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Text style={guessesStyles.guessNumber}>{index + 1}</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              guessesStyles.guessText,
              guessTitle.length > 35 && guessesStyles.guessTextSmall,
            ]}
          >
            {guessTitle}
          </Text>
          <Icon
            name={isCorrect ? "check-circle" : "times-circle"}
            style={[
              guessesStyles.guessIcon,
              isCorrect
                ? guessesStyles.guessIconCorrect
                : guessesStyles.guessIconIncorrect,
            ]}
          />
        </Animated.View>
      </Animated.View>
    )
  }
)

const EmptyGuessTile = ({ index }: { index: number }) => (
  <View style={guessesStyles.emptyGuessTile}>
    <Text style={guessesStyles.guessNumber}>{index + 1}</Text>
  </View>
)

const SkeletonRow = memo(({ index }: { index: number }) => {
  const animatedStyle = useSkeletonAnimation()
  return (
    <Animated.View style={[guessesStyles.skeletonRow, animatedStyle]}>
      <Text style={guessesStyles.guessNumber}>{index + 1}</Text>
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
            <SkeletonRow key={index} index={index} />
          ))}
        </View>
      )
    }

    return (
      <View style={guessesStyles.container}>
        {Array.from({ length: guessesMax }).map((_, index) => {
          const guessId = guesses[index]

          if (!guessId) {
            return <EmptyGuessTile key={index} index={index} />
          }

          const isLastGuess =
            !!lastGuessResult &&
            index === guesses.length - 1 &&
            lastGuessResult.movieId === guessId

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
