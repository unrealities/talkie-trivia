import React, { useEffect, useRef, useState, useMemo, memo } from "react"
import { Animated, Text, View, Easing, ScrollView } from "react-native"
import { cluesStyles } from "../styles/cluesStyles"
import { PlayerGame } from "../models/game"
import { colors } from "../styles/global"

interface CluesProps {
  correctGuess: boolean
  guesses: number[]
  summary: string
  playerGame: PlayerGame
}

interface CountContainerProps {
  currentWordLength: number
  guessNumber: number
  totalWordLength: number
  correctGuess: boolean
}

const splitSummary = (summary: string, splits: number = 5): string[] => {
  if (!summary) return Array(splits).fill("")

  const words = summary.trim().split(" ")
  if (words.length === 0) return Array(splits).fill("")

  const avgLength = Math.max(1, Math.ceil(words.length / splits))
  return Array.from({ length: splits }, (_, i) =>
    words.slice(i * avgLength, (i + 1) * avgLength).join(" ")
  )
}

const CountContainer = memo(
  ({
    currentWordLength,
    guessNumber,
    totalWordLength,
    correctGuess,
  }: CountContainerProps) => (
    <View style={cluesStyles.countContainer}>
      <Text style={cluesStyles.wordCountText}>
        {correctGuess ? totalWordLength : currentWordLength}/{totalWordLength}
      </Text>
    </View>
  )
)

const CluesContainer = memo(
  ({ correctGuess, guesses, summary, playerGame }: CluesProps) => {
    console.log("CluesContainer received summary:", summary)

    const clues = useMemo(
      () => splitSummary(playerGame?.game?.movie?.overview || ""),
      [playerGame?.game?.movie?.overview]
    )

    const [isLoading, setIsLoading] = useState(true)
    const [revealedClues, setRevealedClues] = useState<string[]>([])
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(-10)).current
    const scrollViewRef = useRef<ScrollView>(null)
    const clueHighlightAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
      if (playerGame?.game?.movie?.overview) {
        setIsLoading(false)
      }
    }, [playerGame?.game?.movie?.overview])

    useEffect(() => {
      console.log("CluesContainer: Guesses updated:", guesses)
      if (isLoading) return

      const cluesToReveal = Math.min(guesses.length + 1, clues.length)
      const newRevealedClues = clues.slice(0, cluesToReveal)

      if (newRevealedClues.join(" ") !== revealedClues.join(" ")) {
        fadeAnim.setValue(0)
        slideAnim.setValue(-10)
        clueHighlightAnim.setValue(0)

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(clueHighlightAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]).start(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true })
          Animated.timing(clueHighlightAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.linear,
            delay: 500,
            useNativeDriver: false,
          }).start()
        })

        setRevealedClues(newRevealedClues)
      }
    }, [guesses, clues, isLoading])

    const highlightStyle = clueHighlightAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(0, 0, 0, 0)", colors.quinary],
    })

    return (
      <View style={cluesStyles.container}>
        {isLoading ? (
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
            >
              <Animated.Text
                style={[
                  cluesStyles.text,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                {revealedClues.map((clue, index) => {
                  const isLastClue = index === revealedClues.length - 1
                  return (
                    <Animated.Text
                      key={index}
                      style={[
                        isLastClue && cluesStyles.mostRecentClue,
                        isLastClue && { backgroundColor: highlightStyle },
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
                playerGame?.game?.movie?.overview
                  ? playerGame.game.movie.overview.split(" ").length
                  : 0
              }
              correctGuess={correctGuess}
            />
          </>
        )}
      </View>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.correctGuess === nextProps.correctGuess &&
      prevProps.guesses === nextProps.guesses &&
      prevProps.summary === nextProps.summary &&
      prevProps.playerGame === nextProps.playerGame
    )
  }
)

export default CluesContainer
