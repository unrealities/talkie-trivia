// FILE: src/components/guess/guessRow.tsx

import React, { memo, useEffect } from "react"
import { Text, View, ViewStyle, TextStyle, ImageStyle } from "react-native"
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
import { BasicMovie } from "../../models/movie"
import { Guess, HintInfo, HintType } from "../../models/game"
import { useStyles, Theme } from "../../utils/hooks/useStyles"
import { u } from "../../styles/utils"

type GuessResult = {
  movieId: number
  correct: boolean
  feedback?: string | null
  hintInfo?: HintInfo[] | null
} | null

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
    const styles = useStyles(themedStyles)

    const rotate = useSharedValue(0)
    const shakeX = useSharedValue(0)
    const backgroundColor = useSharedValue(
      styles.guessTile.backgroundColor as string
    )
    const feedbackAnim = useSharedValue(0)

    const guessId = guess.movieId
    const guessMovie = movies.find((m: BasicMovie) => m.id === guessId)
    const guessTitle = guessMovie?.title || "Unknown Movie"
    const releaseYear = guessMovie?.release_date
      ? ` (${new Date(guessMovie.release_date).getFullYear()})`
      : ""
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
      const { colors } = styles.rawTheme
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
      styles,
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
      <Animated.View style={[styles.guessTile, animatedTileStyle]}>
        {feedbackMessage && (
          <Animated.View
            style={[styles.feedbackOverlay, animatedFeedbackStyle]}
          >
            <Text style={styles.feedbackText}>{feedbackMessage}</Text>
          </Animated.View>
        )}
        <Animated.View style={[styles.contentContainer, animatedContentStyle]}>
          <Text style={styles.guessNumber}>{index + 1}</Text>
          <Ionicons
            name={isCorrect ? "checkmark-circle" : "close-circle"}
            style={isCorrect ? styles.iconSuccess : styles.iconError}
          />
          <View style={styles.guessTextContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.guessText}
            >
              {`${guessTitle}${releaseYear}`}
            </Text>
            {hintInfoList && hintInfoList.length > 0 && (
              <View style={styles.hintsWrapper}>
                {hintInfoList.map((hint, idx) => (
                  <View key={idx} style={styles.guessHintContainer}>
                    <Ionicons
                      name={getIconNameForHint(hint.type)}
                      style={styles.guessHintIcon}
                    />
                    <Text style={styles.guessHintText} numberOfLines={1}>
                      {hint.value}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    )
  }
)

interface GuessRowStyles {
  guessTile: ViewStyle
  feedbackOverlay: ViewStyle
  feedbackText: TextStyle
  contentContainer: ViewStyle
  guessNumber: TextStyle
  iconSuccess: TextStyle
  iconError: TextStyle
  guessTextContainer: ViewStyle
  guessText: TextStyle
  hintsWrapper: ViewStyle
  guessHintContainer: ViewStyle
  guessHintIcon: TextStyle
  guessHintText: TextStyle
  rawTheme: Theme // Expose theme for animations
}

const themedStyles = (theme: Theme): GuessRowStyles => ({
  guessTile: {
    ...u.flexRow,
    ...u.alignCenter,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.responsive.scale(8),
    paddingHorizontal: theme.spacing.medium,
    minHeight: theme.responsive.scale(44),
    marginBottom: theme.spacing.small,
    paddingVertical: theme.spacing.small,
    position: "relative",
    overflow: "hidden",
    ...theme.shadows.light,
  },
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.tertiary,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.small,
    zIndex: 1,
  },
  feedbackText: {
    color: theme.colors.background,
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(14),
    textAlign: "center",
  },
  contentContainer: {
    ...u.flexRow,
    ...u.alignCenter,
    ...u.wFull,
  },
  guessNumber: {
    color: theme.colors.textSecondary,
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(14),
    marginRight: theme.spacing.small,
  },
  iconSuccess: {
    marginRight: theme.spacing.medium,
    fontSize: theme.responsive.responsiveFontSize(22),
    color: theme.colors.success,
  },
  iconError: {
    marginRight: theme.spacing.medium,
    fontSize: theme.responsive.responsiveFontSize(22),
    color: theme.colors.error,
  },
  guessTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  guessText: {
    ...theme.typography.bodyText,
    color: theme.colors.textPrimary,
    fontSize: theme.responsive.responsiveFontSize(14),
    lineHeight: theme.responsive.responsiveFontSize(18),
  },
  hintsWrapper: {
    ...u.flexRow,
    flexWrap: "wrap",
    marginTop: theme.spacing.extraSmall,
  },
  guessHintContainer: {
    ...u.flexRow,
    ...u.alignCenter,
    marginRight: theme.spacing.medium,
  },
  guessHintIcon: {
    marginRight: theme.spacing.extraSmall,
    fontSize: theme.responsive.responsiveFontSize(12),
    color: theme.colors.primary,
    opacity: 0.8,
  },
  guessHintText: {
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(11),
    color: theme.colors.primary,
  },
  rawTheme: theme,
})

export default GuessRow
