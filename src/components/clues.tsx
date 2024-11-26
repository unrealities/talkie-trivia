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

const CountContainer = React.memo(({
  currentWordLength,
  guessNumber,
  totalWordLength,
  correctGuess,
}: CountContainerProps) => (
  <View style={cluesStyles.countContainer}>
    <Text 
      style={cluesStyles.wordCountText}
      accessibilityLabel={`Clue progress: ${currentWordLength} out of ${totalWordLength}`}
    >
      {correctGuess ? totalWordLength : currentWordLength}/{totalWordLength}
    </Text>
  </View>
))

const CluesContainer = ({ 
  correctGuess, 
  guesses, 
  summary 
}: CluesProps) => {
  const clues = useMemo(() => splitSummary(summary), [summary])
  const [revealedClues, setRevealedClues] = useState<string[]>([])
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const cluesToReveal = Math.min(guesses.length + 1, clues.length)
    const newRevealedClues = clues.slice(0, cluesToReveal)

    // Only animate if a new clue is added
    if (newRevealedClues.length > revealedClues.length) {
      // Reset animation value
      fadeAnim.setValue(0)

      // Animate the newest clue
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start()
    }

    setRevealedClues(newRevealedClues)
  }, [guesses, correctGuess, clues])

  return (
    <View 
      style={cluesStyles.container}
      accessible
      accessibilityLabel="Clue Container"
    >
      <View style={cluesStyles.textContainer}>
        <Text style={cluesStyles.text}>
          {revealedClues.slice(0, -1).join(" ") + (revealedClues.length > 1 ? " " : "")}
          {revealedClues.length > 0 && (
            <Animated.Text 
              style={[
                cluesStyles.text, 
                { opacity: fadeAnim }
              ]}
            >
              {revealedClues[revealedClues.length - 1]}
            </Animated.Text>
          )}
        </Text>
      </View>
      <CountContainer
        currentWordLength={revealedClues.join(" ").split(" ").length}
        guessNumber={guesses.length}
        totalWordLength={summary.split(" ").length}
        correctGuess={correctGuess}
      />
    </View>
  )
}

export default CluesContainer
