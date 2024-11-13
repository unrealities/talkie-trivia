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
  const summarySplit = summary.split(" ")
  const summarySubLength = Math.floor(summarySplit.length / splits)
  const clues = Array(splits).fill("")
  let wordTrack = 0

  for (let i = 0; i < splits; i++) {
    for (let j = 0; j < summarySubLength; j++) {
      if (wordTrack >= summarySplit.length) break
      clues[i] += `${summarySplit[wordTrack]} `
      wordTrack++
    }
  }

  while (wordTrack < summarySplit.length) {
    clues[splits - 1] += `${summarySplit[wordTrack]} `
    wordTrack++
  }

  return clues.map((clue) => clue.trim())
}

const CluesContainer = (props: CluesProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const fadeAnimTiming = Animated.timing(fadeAnim, {
    duration: 1000,
    toValue: 1,
    useNativeDriver: false,
  })

  useEffect(() => {
    fadeAnimTiming.start()
  }, [props.guesses])

  const clues = splitSummary(props.summary, 5)
  const wordCount = clues.map((clue) => clue.split(" ").length)

  return (
    <View style={styles.container}>
      <Text style={styles.textContainer}>
        {clues.map((clue, i) => {
          if (i <= props.guesses.length || props.correctGuess) {
            return (
              <Animated.Text
                key={i}
                style={{
                  ...styles.text,
                  color:
                    props.guesses.length > i && !props.correctGuess
                      ? colors.primary
                      : colors.secondary,
                  fontFamily:
                    props.guesses.length === i && !props.correctGuess
                      ? "Arvo-Bold"
                      : "Arvo-Regular",
                  opacity: props.guesses.length === i ? fadeAnim : 1,
                }}
              >
                {clue}
              </Animated.Text>
            )
          }
          return null
        })}
      </Text>
      <CountContainer
        currentWordLength={wordCount[props.guesses.length]}
        guessNumber={props.guesses.length}
        totalWordLength={props.summary.split(" ").length}
      />
    </View>
  )
}

const CountContainer = (props: CountContainerProps) => (
  <View style={styles.countContainer}>
    <Text style={styles.wordCountText}>
      {props.guessNumber < 4 ? props.currentWordLength : props.totalWordLength}/
      {props.totalWordLength}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 10,
    marginTop: 10,
    minWidth: 300,
    minHeight: 250,
  },
  countContainer: {
    alignSelf: "flex-end",
    marginTop: 0,
    maxHeight: 16,
    justifyContent: "flex-end",
  },
  text: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: 16,
  },
  textContainer: {
    flexWrap: "wrap",
    minWidth: 280,
    textAlign: "left",
    width: 280,
  },
  wordCountText: {
    color: colors.primary,
    fontFamily: "Arvo-Regular",
    fontSize: 10,
    textAlign: "right",
  },
})

export default CluesContainer
