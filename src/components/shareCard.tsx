import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Image } from "expo-image"
import { BlurView } from "expo-blur"
import { PlayerGame } from "../models/game"
import { getShareCardStyles } from "../styles/shareCardStyles"

interface ShareCardProps {
  playerGame: PlayerGame
}

const ShareCard: React.FC<ShareCardProps> = ({ playerGame }) => {
  const styles = getShareCardStyles()

  const date =
    playerGame.startDate instanceof Date
      ? playerGame.startDate
      : new Date(playerGame.startDate)
  const dateString = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const posterUri = `https://image.tmdb.org/t/p/w500${playerGame.movie.poster_path}`

  let resultLine = ""
  let grid = ""
  const guessCount = playerGame.guesses.length
  const isWin = playerGame.correctAnswer

  if (isWin) {
    resultLine = `Guessed in ${guessCount}/${playerGame.guessesMax} tries!`
    grid = "🟥 ".repeat(guessCount - 1) + "🟩"
  } else if (playerGame.gaveUp) {
    resultLine = `Gave up after ${guessCount} guess${
      guessCount === 1 ? "" : "es"
    }.`
    grid = "🟥 ".repeat(guessCount) + "⏹️"
  } else {
    resultLine = `Didn't guess the movie.`
    grid = "🟥 ".repeat(playerGame.guessesMax).trim()
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: posterUri }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      {!isWin && (
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
      )}
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Talkie Trivia 🎬</Text>
          <Text style={styles.date}>{dateString}</Text>
        </View>

        <View style={styles.resultsContainer}>
          <Text style={styles.movieTitle}>{playerGame.movie.title}</Text>
          <Text style={styles.resultLine}>{resultLine}</Text>
          <Text style={styles.grid}>{grid}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Play at talkie-trivia.com</Text>
        </View>
      </View>
    </View>
  )
}

export default ShareCard
