import React, { memo, useEffect, useMemo } from "react"
import { Text, View } from "react-native"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated"
import Ionicons from "@expo/vector-icons/Ionicons"

import { getGuessesStyles } from "../styles/guessesStyles"
import { useSkeletonAnimation } from "../utils/hooks/useSkeletonAnimation"
import { BasicMovie } from "../models/movie"
import { useTheme } from "../contexts/themeContext"
import { useGameStore } from "../state/gameStore"
import { Guess, HintInfo, HintType, PlayerGame } from "../models/game"
import { useShallow } from "zustand/react/shallow"

type GuessResult = {
  movieId: number
  correct: boolean
  feedback?: string | null
  hintInfo?: HintInfo[] | null
} | null

interface GuessesContainerProps {
  lastGuessResult: GuessResult
  gameForDisplay?: PlayerGame
  allMoviesForDisplay?: readonly BasicMovie[]
}

interface GuessRowProps {
  index: number
  guess: Guess
  movies: readonly BasicMovie[]
  isLastGuess: boolean
  lastGuessResult: GuessResult
  correctMovieId: number
}

const GuessRow = memo(
  ({
    index,
    guess,
    movies,
    isLastGuess,
    lastGuessResult,
    correctMovieId,
  }: GuessRowProps) => {
    const { colors } = useTheme()
    const guessesStyles = useMemo(() => getGuessesStyles(colors), [colors])

    const rotate = useSharedValue(0)
    const shakeX = useSharedValue(0)
    const backgroundColor = useSharedValue(colors.surface)
    const feedbackAnim = useSharedValue(0)

    const guessId = guess.movieId
    const guessTitle =
      movies.find((m: BasicMovie) => m.id === guessId)?.title || "Unknown Movie"
    const isCorrect = guess.movieId === correctMovieId
    const feedbackMessage =
      isLastGuess && !isCorrect ? lastGuessResult?.feedback : null
    const hintInfoList = guess.hintInfo

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

    const animatedFeedbackStyle = useAnimatedStyle(() => ({
      opacity: feedbackAnim.value,
      transform: [
        {
          scale: interpolate(feedbackAnim.value, [0, 1], [0.8, 1]),
        },
      ],
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
          feedbackAnim.value = withSequence(
            withDelay(700, withTiming(1, { duration: 300 })),
            withDelay(
              1800,
              withTiming(0, { duration: 300, easing: Easing.ease })
            )
          )

          shakeX.value = withSequence(
            withDelay(2800, withTiming(-15, { duration: 60 })),
            withTiming(15, { duration: 120 }),
            withTiming(-15, { duration: 120 }),
            withTiming(0, { duration: 60 })
          )

          backgroundColor.value = withSequence(
            withDelay(2700, withTiming(colors.error, { duration: 150 })),
            withTiming(colors.surface, { duration: 800 })
          )
        }
      }
    }, [
      isLastGuess,
      lastGuessResult,
      isCorrect,
      colors,
      backgroundColor,
      rotate,
      shakeX,
      feedbackAnim,
    ])

    const getIconNameForHint = (
      hint: HintType
    ): keyof typeof Ionicons.glyphMap => {
      const iconMap: Record<HintType, keyof typeof Ionicons.glyphMap> = {
        decade: "calendar-outline",
        director: "film-outline",
        actor: "person-outline",
        genre: "folder-open-outline",
      }
      return iconMap[hint]
    }

    return (
      <Animated.View style={[guessesStyles.guessTile, animatedTileStyle]}>
        {feedbackMessage && (
          <Animated.View
            style={[guessesStyles.feedbackOverlay, animatedFeedbackStyle]}
          >
            <Text style={guessesStyles.feedbackText}>{feedbackMessage}</Text>
          </Animated.View>
        )}
        <Animated.View
          style={[
            guessesStyles.container,
            animatedContentStyle,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Text style={guessesStyles.guessNumber}>{index + 1}</Text>
          <Ionicons
            name={isCorrect ? "checkmark-circle" : "close-circle"}
            style={guessesStyles.guessIcon}
            color={isCorrect ? colors.success : colors.error}
          />
          <View style={guessesStyles.guessTextContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={guessesStyles.guessText}
            >
              {guessTitle}
            </Text>
            <View>
              {hintInfoList?.map((hint, idx) => (
                <View key={idx} style={guessesStyles.guessHintContainer}>
                  <Ionicons
                    name={getIconNameForHint(hint.type)}
                    style={guessesStyles.guessHintIcon}
                    color={colors.primary}
                  />
                  <Text style={guessesStyles.guessHintText} numberOfLines={1}>
                    {hint.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    )
  }
)

const EmptyGuessTile = ({ index }: { index: number }) => {
  const { colors } = useTheme()
  const guessesStyles = useMemo(() => getGuessesStyles(colors), [colors])
  return (
    <View style={guessesStyles.emptyGuessTile}>
      <Text style={guessesStyles.guessNumber}>{index + 1}</Text>
    </View>
  )
}

const SkeletonRow = memo(({ index }: { index: number }) => {
  const { colors } = useTheme()
  const guessesStyles = useMemo(() => getGuessesStyles(colors), [colors])
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
  ({
    lastGuessResult,
    gameForDisplay,
    allMoviesForDisplay,
  }: GuessesContainerProps) => {
    const { loading, playerGame, basicMovies } = useGameStore(
      useShallow((state) => ({
        loading: state.loading,
        playerGame: state.playerGame,
        basicMovies: state.basicMovies,
      }))
    )

    const isDataLoading = gameForDisplay ? false : loading
    const currentGame = gameForDisplay || playerGame
    const movies = allMoviesForDisplay || basicMovies

    const { colors } = useTheme()
    const guessesStyles = useMemo(() => getGuessesStyles(colors), [colors])
    const { guesses, guessesMax, movie } = currentGame
    const correctMovieId = movie.id

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
          const guess = guesses[index]

          if (!guess) {
            return <EmptyGuessTile key={index} index={index} />
          }

          const isLastGuess =
            !!lastGuessResult &&
            index === guesses.length - 1 &&
            lastGuessResult.movieId === guess.movieId

          return (
            <GuessRow
              key={`${guess.movieId}-${index}`}
              index={index}
              guess={guess}
              movies={movies}
              isLastGuess={isLastGuess}
              lastGuessResult={lastGuessResult}
              correctMovieId={correctMovieId}
            />
          )
        })}
      </View>
    )
  }
)

export default GuessesContainer
