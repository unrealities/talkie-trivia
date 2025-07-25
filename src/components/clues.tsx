import React, { useEffect, useRef, useState, useMemo, memo } from "react"
import { Text, View, Easing, ScrollView } from "react-native"
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated"
import { cluesStyles } from "../styles/cluesStyles"
import { colors } from "../styles/global"
import { useGame } from "../contexts/gameContext"
import { hapticsService } from "../utils/hapticsService"

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
  ({ currentWordLength, guessNumber, totalWordLength, correctGuess }) => (
    <View style={cluesStyles.countContainer}>
      <Text style={cluesStyles.wordCountText}>
        {correctGuess ? totalWordLength : currentWordLength}/{totalWordLength}
      </Text>
    </View>
  )
)

const CluesContainer = memo(() => {
  const { playerGame, isInteractionsDisabled } = useGame()
  const { correctAnswer, guesses } = playerGame

  const clues = useMemo(
    () => splitSummary(playerGame?.movie?.overview || ""),
    [playerGame?.movie?.overview]
  )

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [revealedClues, setRevealedClues] = useState<string[]>([])
  const fadeAnim = useSharedValue(0)
  const slideAnim = useSharedValue(-10)
  const clueHighlightAnim = useSharedValue(0)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (playerGame?.movie?.overview) {
      setIsLoading(false)
    }
  }, [playerGame?.movie?.overview])

  useEffect(() => {
    if (isLoading) return

    const numCluesToReveal =
      correctAnswer || isInteractionsDisabled
        ? clues.length
        : Math.min(guesses.length + 1, clues.length)

    if (numCluesToReveal !== revealedClues.length) {
      hapticsService.light()

      const newRevealedClues = clues.slice(0, numCluesToReveal)

      fadeAnim.value = withTiming(0)
      slideAnim.value = withTiming(-10)
      clueHighlightAnim.value = withTiming(0)

      const startAnimations = () => {
        fadeAnim.value = withTiming(1, {
          duration: 500,
          easing: Easing.inOut(Easing.ease),
        })
        slideAnim.value = withTiming(0, {
          duration: 500,
          easing: Easing.inOut(Easing.ease),
        })
        clueHighlightAnim.value = withTiming(1, {
          duration: 700,
          easing: Easing.linear,
        })
      }

      setRevealedClues(newRevealedClues)
      runOnJS(startAnimations)()

      scrollViewRef.current?.scrollToEnd({ animated: true })
    }
  }, [isLoading, correctAnswer, isInteractionsDisabled, guesses.length, clues])

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }))

  const highlightStyle = useAnimatedStyle(() => ({
    backgroundColor:
      clueHighlightAnim.value > 0.5 ? colors.primary : "rgba(0, 0, 0, 0)",
  }))

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
            <Animated.Text style={[cluesStyles.text, animatedTextStyle]}>
              {revealedClues.map((clue, index) => {
                const isLastClue = index === revealedClues.length - 1
                return (
                  <Animated.Text
                    key={index}
                    style={[
                      cluesStyles.text,
                      !correctAnswer &&
                        !isInteractionsDisabled &&
                        isLastClue &&
                        cluesStyles.mostRecentClue,
                      !correctAnswer &&
                        !isInteractionsDisabled &&
                        isLastClue &&
                        highlightStyle,
                    ]}
                  >
                    {clue}
                    {index < revealedClues.length - 1 ? " " : ""}
                  </Animated.Text>
                )
              })}
            </Animated.Text>
          </ScrollView>
          <CountContainer
            currentWordLength={revealedClues.join(" ").split(" ").length}
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
