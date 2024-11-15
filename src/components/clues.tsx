import React, { useEffect, useRef, useState } from "react"
import { Animated, StyleSheet, Text, View } from "react-native"
import { colors } from "../styles/global"

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
  const avgLength = Math.ceil(words.length / splits)
  return Array.from({ length: splits }, (_, i) =>
    words.slice(i * avgLength, (i + 1) * avgLength).join(" ")
  )
}

const CluesContainer = ({ correctGuess, guesses, summary }: CluesProps) => {
  const fadeAnim = useRef(new Animated.Value(1)).current
  const [revealedClues, setRevealedClues] = useState("")

  const clues = splitSummary(summary, 5)

  useEffect(() => {
    // Calculate the number of clues to reveal based on guesses and correct answer
    const cluesToReveal = Math.min(guesses.length + 1, clues.length)
    const newRevealedClues = clues.slice(0, cluesToReveal).join(" ")
    setRevealedClues(newRevealedClues)

    // Reset animation and fade in each time clues are updated
    fadeAnim.setValue(0)
    Animated.timing(fadeAnim, {
      duration: 1000,
      toValue: 1,
      useNativeDriver: false,
    }).start()
  }, [guesses, correctGuess]) // Update when guesses or correct answer changes

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
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
  <View style={styles.countContainer}>
    <Text style={styles.wordCountText}>
      {correctGuess ? totalWordLength : currentWordLength}/{totalWordLength}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    marginVertical: 10,
    minWidth: 300,
    minHeight: 250,
  },
  countContainer: {
    alignSelf: "flex-end",
    marginTop: 8,
    maxHeight: 16,
    justifyContent: "flex-end",
  },
  textContainer: {
    flexWrap: "wrap",
    maxWidth: 300,
    minWidth: 280,
    textAlign: "left",
    paddingHorizontal: 10,
  },
  text: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: 16,
    paddingBottom: 4,
  },
  wordCountText: {
    color: colors.primary,
    fontFamily: "Arvo-Regular",
    fontSize: 10,
    textAlign: "right",
  },
})

export default CluesContainer
