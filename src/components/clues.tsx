import React, { useEffect, useRef, useState, useMemo } from "react"
import { Animated, Text, View, Easing } from "react-native"
import { cluesStyles } from "../styles/cluesStyles"

interface CluesProps {
  correctGuess: boolean
  guesses: number[]
  summary: string
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

const CountContainer = React.memo(
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

const CluesContainer = ({ correctGuess, guesses, summary }: CluesProps) => {
  const clues = useMemo(() => splitSummary(summary), [summary])
  const [revealedClues, setRevealedClues] = useState<string>("")
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(-10)).current

  useEffect(() => {
    const cluesToReveal = Math.min(guesses.length + 1, clues.length)
    const newRevealedClues = clues.slice(0, cluesToReveal).join(" ")

    if (newRevealedClues.length > revealedClues.length) {
      fadeAnim.setValue(0)
      slideAnim.setValue(-10)

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
      ]).start()
    }

    setRevealedClues(newRevealedClues)
  }, [guesses, correctGuess, clues])

  return (
    <View style={cluesStyles.container}>
      <View style={cluesStyles.textContainer}>
        <Animated.Text
          style={[
            cluesStyles.text,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {revealedClues}
        </Animated.Text>
      </View>
      <CountContainer
        currentWordLength={revealedClues.split(" ").length}
        guessNumber={guesses.length}
        totalWordLength={summary.split(" ").length}
        correctGuess={correctGuess}
      />
    </View>
  )
}

export default CluesContainer
