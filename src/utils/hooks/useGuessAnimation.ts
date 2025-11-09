import { useEffect } from "react"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Easing,
} from "react-native-reanimated"
import { Theme } from "./useStyles"
import { HintInfo } from "../../models/game"

type GuessResult = {
  itemId: number | string
  correct: boolean
  feedback?: string | null
  hintInfo?: HintInfo[] | null
} | null

interface UseGuessAnimationProps {
  isCorrect: boolean
  isLastGuess: boolean
  lastGuessResult: GuessResult
  theme: Theme
}

/**
 * A custom hook to manage the complex animation sequences for a guess row.
 * It encapsulates all `react-native-reanimated` logic, cleaning up the component.
 *
 * @param {UseGuessAnimationProps} props - The props required to determine the animation logic.
 * @returns An object containing the memoized animated styles for the component to use.
 */
export const useGuessAnimation = ({
  isCorrect,
  isLastGuess,
  lastGuessResult,
  theme,
}: UseGuessAnimationProps) => {
  const { colors } = theme

  // --- Shared Values for Animations ---
  const rotate = useSharedValue(0)
  const shakeX = useSharedValue(0)
  const backgroundColor = useSharedValue(theme.colors.surface)
  const feedbackAnim = useSharedValue(0)

  // --- Animation Trigger Effect ---
  useEffect(() => {
    // Reveal animation for every guess row
    rotate.value = withTiming(1, { duration: 600 })

    // Only run the success/failure animations for the most recent guess
    if (isLastGuess && lastGuessResult) {
      if (isCorrect) {
        // Success animation: Brief success color flash
        backgroundColor.value = withSequence(
          withDelay(600, withTiming(colors.success, { duration: 400 })),
          withDelay(1000, withTiming(colors.surface, { duration: 500 }))
        )
      } else {
        // Failure animation sequence:
        // 1. Show feedback overlay
        feedbackAnim.value = withSequence(
          withDelay(700, withTiming(1, { duration: 300 })),
          withDelay(1800, withTiming(0, { duration: 300, easing: Easing.ease }))
        )
        // 2. After feedback, shake the tile and flash error color
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

  // --- Animated Style Definitions ---
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

  return {
    animatedTileStyle,
    animatedContentStyle,
    animatedFeedbackStyle,
  }
}
