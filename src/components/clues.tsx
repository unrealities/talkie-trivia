import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  memo,
  useCallback,
} from "react"
import { Text, View, Easing, ScrollView, Pressable } from "react-native"
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
  withSequence,
  withDelay,
  interpolateColor,
} from "react-native-reanimated"
import { getCluesStyles } from "../styles/cluesStyles"
import { useGame } from "../contexts/gameContext"
import { hapticsService } from "../utils/hapticsService"
import { useTheme } from "../contexts/themeContext"

const splitSummary = (summary: string, splits: number = 5): string[] => {
  if (!summary) return Array(splits).fill("")
  const words = summary.trim().split(" ")
  if (words.length === 0) return Array(splits).fill("")
  const avgLength = Math.max(1, Math.ceil(words.length / splits))
  return Array.from({ length: splits }, (_, i) =>
    words.slice(i * avgLength, (i + 1) * avgLength).join(" ")
  )
}

interface CountContainerProps {
  currentWordLength: number
  guessNumber: number
  totalWordLength: number
  correctGuess: boolean
}

const CountContainer = memo<CountContainerProps>(
  ({ currentWordLength, guessNumber, totalWordLength, correctGuess }) => {
    const { colors } = useTheme()
    const cluesStyles = useMemo(() => getCluesStyles(colors), [colors])
    return (
      <View style={cluesStyles.countContainer}>
        <Text style={cluesStyles.wordCountText}>
          {correctGuess ? totalWordLength : currentWordLength}/{totalWordLength}
        </Text>
      </View>
    )
  }
)

const CluesContainer = memo(() => {
  const { playerGame, isInteractionsDisabled } = useGame()
  const { colors } = useTheme()
  const cluesStyles = useMemo(() => getCluesStyles(colors), [colors])
  const { correctAnswer, guesses } = playerGame

  const clues = useMemo(
    () => splitSummary(playerGame?.movie?.overview || ""),
    [playerGame?.movie?.overview]
  )

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [revealedClues, setRevealedClues] = useState<string[]>([])
  const [typewriterText, setTypewriterText] = useState("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastClueRef = useRef<string>("")

  const fadeAnim = useSharedValue(0)
  const slideAnim = useSharedValue(-10)
  const clueHighlightAnim = useSharedValue(0)
  const scrollViewRef = useRef<ScrollView>(null)

  const oldCluesText = revealedClues.slice(0, -1).join(" ")
  const spacer = oldCluesText && typewriterText ? " " : ""

  const handleSkipAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setTypewriterText(lastClueRef.current)
      hapticsService.light()
    }
  }, [])

  useEffect(() => {
    if (playerGame?.movie?.overview) {
      setIsLoading(false)
    }
  }, [playerGame?.movie?.overview])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (isLoading) return

    const numCluesToReveal =
      correctAnswer || isInteractionsDisabled
        ? clues.length
        : Math.min(guesses.length + 1, clues.length)

    if (numCluesToReveal > revealedClues.length) {
      hapticsService.light()
      const newRevealedClues = clues.slice(0, numCluesToReveal)
      const lastClue = newRevealedClues[newRevealedClues.length - 1] || ""
      lastClueRef.current = lastClue

      const startReanimatedAnimations = () => {
        fadeAnim.value = withTiming(1, { duration: 500 })
        slideAnim.value = withTiming(0, { duration: 500 })
        clueHighlightAnim.value = withSequence(
          withTiming(1, { duration: 400 }),
          withDelay(800, withTiming(0, { duration: 500 }))
        )
      }
      runOnJS(startReanimatedAnimations)()

      let charIndex = 0
      setTypewriterText("")
      intervalRef.current = setInterval(() => {
        if (charIndex < lastClue.length) {
          setTypewriterText((prev) => lastClue.substring(0, charIndex + 1))
          charIndex++
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        }
      }, 50)

      setRevealedClues(newRevealedClues)
      scrollViewRef.current?.scrollToEnd({ animated: true })
    } else if (numCluesToReveal < revealedClues.length) {
      setRevealedClues(clues.slice(0, numCluesToReveal))
      setTypewriterText(clues[clues.length - 1] || "")
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isLoading, correctAnswer, isInteractionsDisabled, guesses.length, clues])

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }))

  const highlightStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      clueHighlightAnim.value,
      [0, 1],
      ["transparent", colors.primary]
    ),
  }))

  const isGameOver = correctAnswer || isInteractionsDisabled

  return (
    <View style={cluesStyles.container}>
      {isLoading ? (
        <View style={cluesStyles.skeletonContainer}>
          <View style={cluesStyles.skeletonLine} />
          <View style={cluesStyles.skeletonLine} />
          <View
            style={[cluesStyles.skeletonLine, cluesStyles.skeletonLineShort]}
          />
          <View
            style={[cluesStyles.skeletonLine, cluesStyles.skeletonLineShort]}
          />
        </View>
      ) : (
        <>
          <ScrollView
            ref={scrollViewRef}
            style={cluesStyles.scrollView}
            contentContainerStyle={cluesStyles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              onPress={isGameOver ? undefined : handleSkipAnimation}
              accessible={!isGameOver}
              accessibilityLabel={
                !isGameOver ? "Tap to reveal the full clue immediately" : ""
              }
            >
              <Animated.View
                style={[animatedContainerStyle, cluesStyles.cluesBox]}
              >
                <Text style={cluesStyles.text}>
                  {oldCluesText}
                  {spacer}
                  {isGameOver ? (
                    <Text>{revealedClues[revealedClues.length - 1]}</Text>
                  ) : (
                    <Animated.Text style={[highlightStyle]}>
                      {typewriterText}
                    </Animated.Text>
                  )}
                </Text>
              </Animated.View>
            </Pressable>
          </ScrollView>
          <CountContainer
            currentWordLength={
              revealedClues.join(" ").split(" ").filter(Boolean).length
            }
            guessNumber={guesses.length}
            totalWordLength={
              playerGame?.movie?.overview
                ? playerGame.movie.overview.split(" ").length
                : 0
            }
            correctGuess={correctAnswer}
          />
        </>
      )}
    </View>
  )
})

export default CluesContainer
