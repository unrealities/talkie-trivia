import React, { useEffect, useRef, useState, useMemo } from "react"
import { Animated, Text, View } from "react-native"
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
}

const splitSummary = (summary: string, splits: number) => {
  const words = summary.split(" ")
  if (words.length === 0) return Array(splits).fill("")
  const avgLength = Math.ceil(words.length / splits)
  return Array.from({ length: splits }, (_, i) =>
    words.slice(i * avgLength, (i + 1) * avgLength).join(" ")
  )
}

const CluesContainer = ({ correctGuess, guesses, summary }: CluesProps) => {
  const fadeAnim = useRef(new Animated.Value(1)).current
  const [revealedClues, setRevealedClues] = useState("")

  const clues = useMemo(() => splitSummary(summary, 5), [summary])

  useEffect(() => {
    const cluesToReveal = Math.min(guesses.length + 1, clues.length)
    const newRevealedClues = clues.slice(0, cluesToReveal).join(" ")
    setRevealedClues(newRevealedClues)

    fadeAnim.setValue(0)
    Animated.timing(fadeAnim, {
      duration: 1000,
      toValue: 1,
      useNativeDriver: false,
    }).start()
  }, [guesses, correctGuess, clues])

  return (
    <View style={cluesStyles.container}>
      <View style={cluesStyles.textContainer}>
        <Animated.Text style={[cluesStyles.text, { opacity: fadeAnim }]}>
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

const CountContainer = ({
  currentWordLength,
  guessNumber,
  totalWordLength,
  correctGuess,
}: CountContainerProps & { correctGuess: boolean }) => (
  <View style={cluesStyles.countContainer}>
    <Text style={cluesStyles.wordCountText}>
      {correctGuess ? totalWordLength : currentWordLength}/{totalWordLength}
    </Text>
  </View>
)

export default CluesContainer
