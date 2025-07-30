import React from "react"
import { View, Pressable, Text, Share, Alert } from "react-native"
import { Image } from "expo-image"
import GuessesContainer from "./guesses"
import Actors from "./actors"
import { PlayerGame } from "../models/game"
import { movieStyles } from "../styles/movieStyles"
import { generateShareMessage } from "../utils/shareUtils"
import { hapticsService } from "../utils/hapticsService"
import { analyticsService } from "../utils/analyticsService"

interface GameOverViewProps {
  playerGame: PlayerGame
  lastGuessResult: { movieId: number; correct: boolean } | null
}

const GameOverView: React.FC<GameOverViewProps> = ({
  playerGame,
  lastGuessResult,
}) => {
  const handleShare = async () => {
    hapticsService.medium()
    try {
      const outcome = playerGame.correctAnswer
        ? "win"
        : playerGame.gaveUp
        ? "give_up"
        : "lose"
      analyticsService.trackShareResults(outcome)
      const message = generateShareMessage(playerGame)
      await Share.share(
        { message, title: "Talkie Trivia Results" },
        { dialogTitle: "Share your Talkie Trivia results!" }
      )
    } catch (error: any) {
      Alert.alert("Share Error", error.message)
    }
  }

  const posterUri = playerGame.movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${playerGame.movie.poster_path}`
    : undefined

  const resultMessage = playerGame.correctAnswer
    ? `You got it in ${playerGame.guesses.length} guess${
        playerGame.guesses.length > 1 ? "es" : ""
      }!`
    : playerGame.gaveUp
    ? "Sometimes you just know when to fold 'em."
    : "So close! Better luck next time."

  return (
    <View style={{ width: "100%" }}>
      <View style={movieStyles.gameOverCard}>
        <Text style={movieStyles.gameOverSubText}>{resultMessage}</Text>
        <Image
          source={{ uri: posterUri }}
          style={movieStyles.gameOverPoster}
          placeholder={require("../../assets/movie_default.png")}
          contentFit="cover"
        />
        <Text style={movieStyles.gameOverTitle}>{playerGame.movie.title}</Text>
        {playerGame.movie.director?.name && (
          <Text style={movieStyles.gameOverDirector}>
            Directed by {playerGame.movie.director.name}
          </Text>
        )}
        {playerGame.movie.actors && playerGame.movie.actors.length > 0 && (
          <>
            <Text style={movieStyles.gameOverStarring}>Starring</Text>
            <Actors actors={playerGame.movie.actors} maxDisplay={3} />
          </>
        )}
      </View>

      <GuessesContainer lastGuessResult={lastGuessResult} />

      <View style={movieStyles.gameOverButtonsContainer}>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            movieStyles.gameOverButton,
            pressed && movieStyles.pressedButton,
          ]}
        >
          <Text style={movieStyles.gameOverButtonText}>Share Your Result</Text>
        </Pressable>
      </View>

      <Text style={movieStyles.comeBackText}>
        Come back tomorrow for a new movie!
      </Text>
    </View>
  )
}

export default GameOverView
