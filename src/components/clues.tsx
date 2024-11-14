import React, { useEffect, useRef } from "react"
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
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      duration: 1000,
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }, [guesses.length])

  const clues = splitSummary(summary, 5)
  const wordCounts = clues.map((clue) => clue.split(" ").length)

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {clues.map((clue, index) => {
          const isLastGuess = guesses.length === index
          const shouldShowClue = index <= guesses.length || correctGuess

          if (shouldShowClue) {
            return (
              <Animated.Text
                key={index}
                style={[
                  styles.text,
                  {
                    color:
                      index < guesses.length && !correctGuess
                        ? colors.primary
                        : colors.secondary,
                    fontFamily:
                      isLastGuess && !correctGuess
                        ? "Arvo-Bold"
                        : "Arvo-Regular",
                    opacity: isLastGuess ? fadeAnim : 1,
                  },
                ]}
              >
                {clue}
              </Animated.Text>
            )
          }
          return null
        })}
      </View>
      <CountContainer
        currentWordLength={
          wordCounts[guesses.length] || wordCounts.slice(-1)[0]
        }
        guessNumber={guesses.length}
        totalWordLength={summary.split(" ").length}
      />
    </View>
  )
}

const CountContainer = ({
  currentWordLength,
  guessNumber,
  totalWordLength,
}: CountContainerProps) => (
  <View style={styles.countContainer}>
    <Text style={styles.wordCountText}>
      {guessNumber < 4 ? currentWordLength : totalWordLength}/{totalWordLength}
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
