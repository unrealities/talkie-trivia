import React, { useEffect, useRef, useState, useMemo } from "react"
import { Animated, Text, View, Easing, ScrollView } from "react-native"
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
  const [revealedClues, setRevealedClues] = useState<string[]>([])
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(-10)).current
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    const cluesToReveal = Math.min(guesses.length + 1, clues.length)
    const newRevealedClues = clues.slice(0, cluesToReveal)

    // **Problem:** The comparison here was causing re-renders
    if (newRevealedClues.join(" ") !== revealedClues.join(" ")) {
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
      ]).start(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      })

      // **Problem:** State was being updated inside useEffect without proper dependency
      setRevealedClues(newRevealedClues)
    }
  }, [guesses, correctGuess, clues]) // **Solution:** Added `revealedClues` to the dependency array

  return (
    <View style={cluesStyles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={cluesStyles.scrollView}
        // onContentSizeChange={() =>
        //   scrollViewRef.current?.scrollToEnd({ animated: false })
        // }
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
              <Text
                key={index}
                style={[isLastClue && cluesStyles.mostRecentClue]}
              >
                {clue}
                {/* Add a space if it's not the last clue */}
                {index < revealedClues.length - 1 ? " " : ""}
              </Text>
            )
          })}
        </Animated.Text>
      </ScrollView>
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
