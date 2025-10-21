import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  memo,
  useCallback,
} from "react"
import { Text, View, ScrollView, Pressable } from "react-native"
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
  withSequence,
  withDelay,
  interpolateColor,
  useAnimatedReaction,
  cancelAnimation,
  Easing,
} from "react-native-reanimated"
import { getCluesStyles } from "../styles/cluesStyles"
import { hapticsService } from "../utils/hapticsService"
import { useTheme } from "../contexts/themeContext"
import { ANIMATION_CONSTANTS } from "../config/constants"
import { useGameStore } from "../state/gameStore"
import { useShallow } from "zustand/react/shallow"
import { DIFFICULTY_MODES } from "../config/difficulty"

const splitSummary = (summary: string, splits: number = 5): string[] => {
  if (!summary) return Array(splits).fill("")
  const words = summary.trim().split(/\s+/)
  if (words.length === 0) return Array(splits).fill("")
  const avgLength = Math.max(1, Math.ceil(words.length / splits))
  return Array.from({ length: splits }, (_, i) =>
    words.slice(i * avgLength, (i + 1) * avgLength).join(" ")
  ).filter((chunk) => chunk.length > 0)
}

interface CountContainerProps {
  currentWordLength: number
  totalWordLength: number
}

const CountContainer = memo<CountContainerProps>(
  ({ currentWordLength, totalWordLength }) => {
    const { colors } = useTheme()
    const cluesStyles = useMemo(() => getCluesStyles(colors), [colors])
    return (
      <View style={cluesStyles.countContainer}>
        <Text style={cluesStyles.wordCountText}>
          {currentWordLength}/{totalWordLength} words revealed
        </Text>
      </View>
    )
  }
)

const CluesContainer = memo(() => {
  const { colors } = useTheme()
  const cluesStyles = useMemo(() => getCluesStyles(colors), [colors])

  const {
    correctAnswer,
    guesses,
    movieOverview,
    isInteractionsDisabled,
    difficulty,
    loading,
  } = useGameStore(
    useShallow((state) => ({
      correctAnswer: state.playerGame.correctAnswer,
      guesses: state.playerGame.guesses,
      movieOverview: state.playerGame.movie?.overview,
      isInteractionsDisabled: state.isInteractionsDisabled,
      difficulty: state.difficulty,
      loading: state.loading,
    }))
  )

  const clues = useMemo(
    () => splitSummary(movieOverview || ""),
    [movieOverview]
  )

  const [revealedClues, setRevealedClues] = useState<string[]>([])
  const [typewriterText, setTypewriterText] = useState("")
  const lastClueRef = useRef<string>("")

  const highlightProgress = useSharedValue(0)
  const typewriterProgress = useSharedValue(0)
  const scrollViewRef = useRef<ScrollView>(null)

  const oldCluesText = revealedClues.slice(0, -1).join(" ")

  const handleSkipAnimation = useCallback(() => {
    cancelAnimation(typewriterProgress)
    setTypewriterText(lastClueRef.current)
    hapticsService.light()
  }, [typewriterProgress])

  useAnimatedReaction(
    () => Math.floor(typewriterProgress.value),
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        runOnJS(setTypewriterText)(
          lastClueRef.current.substring(0, currentValue)
        )
      }
    },
    [typewriterProgress]
  )

  useEffect(() => {
    if (loading) return

    let numCluesToReveal
    const hintStrategy = DIFFICULTY_MODES[difficulty]?.hintStrategy
    const currentGuessCount = guesses.length

    if (correctAnswer || isInteractionsDisabled) {
      numCluesToReveal = clues.length
    } else if (
      hintStrategy === "ALL_REVEALED" ||
      hintStrategy === "HINTS_ONLY_REVEALED"
    ) {
      // For modes where clues are still progressive, calculate as normal.
      numCluesToReveal = Math.min(currentGuessCount + 1, clues.length)
    } else {
      // Standard reveal for all other progressive modes.
      numCluesToReveal = Math.min(currentGuessCount + 1, clues.length)
    }

    if (numCluesToReveal > revealedClues.length) {
      hapticsService.light()
      const newRevealedClues = clues.slice(0, numCluesToReveal)
      const lastClue = newRevealedClues[newRevealedClues.length - 1] || ""
      lastClueRef.current = lastClue

      highlightProgress.value = 0
      typewriterProgress.value = 0
      setTypewriterText("")

      const typewriterDuration =
        lastClue.length * ANIMATION_CONSTANTS.TYPEWRITER_CHAR_DURATION

      highlightProgress.value = withSequence(
        withTiming(1, { duration: 400 }),
        withDelay(typewriterDuration + 200, withTiming(0, { duration: 500 }))
      )

      typewriterProgress.value = withDelay(
        200,
        withTiming(lastClue.length, {
          duration: typewriterDuration,
          easing: Easing.linear,
        })
      )
      setRevealedClues(newRevealedClues)

      setTimeout(
        () => scrollViewRef.current?.scrollToEnd({ animated: true }),
        100
      )
    } else if (numCluesToReveal < revealedClues.length) {
      // This handles cases where difficulty is increased mid-game, reducing revealed clues.
      setRevealedClues(clues.slice(0, numCluesToReveal))
      const lastClue = clues[numCluesToReveal - 1] || ""
      setTypewriterText(lastClue)
      lastClueRef.current = lastClue
    }

    return () => {
      cancelAnimation(typewriterProgress)
      cancelAnimation(highlightProgress)
    }
  }, [
    loading,
    correctAnswer,
    isInteractionsDisabled,
    guesses.length,
    clues,
    difficulty,
  ])

  const animatedHighlightStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      highlightProgress.value,
      [0, 1],
      ["transparent", colors.primary]
    )
    const color = interpolateColor(
      highlightProgress.value,
      [0, 1],
      [colors.textPrimary, colors.background]
    )
    return { backgroundColor, color }
  })

  const isGameOver = correctAnswer || isInteractionsDisabled

  return (
    <View style={cluesStyles.container}>
      {loading ? (
        <View style={cluesStyles.skeletonContainer}>
          <View style={cluesStyles.skeletonLine} />
          <View style={cluesStyles.skeletonLine} />
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
              <View style={cluesStyles.cluesBox}>
                <Text style={cluesStyles.text}>
                  {oldCluesText}
                  {oldCluesText ? " " : ""}
                  {isGameOver ? (
                    <Text>
                      {clues.slice(revealedClues.length - 1).join(" ")}
                    </Text>
                  ) : (
                    <Animated.Text style={animatedHighlightStyle}>
                      {typewriterText}
                    </Animated.Text>
                  )}
                </Text>
              </View>
            </Pressable>
          </ScrollView>
          <CountContainer
            currentWordLength={
              revealedClues.join(" ").split(" ").filter(Boolean).length
            }
            totalWordLength={clues.join(" ").split(" ").filter(Boolean).length}
          />
        </>
      )}
    </View>
  )
})

export default CluesContainer
