import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  View,
  Pressable,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"
import CountdownTimer from "./countdownTimer"
import Facts from "./facts"
import PersonalizedStatsMessage from "./personalizedStatsMessage"
import { PlayerGame } from "../models/game"
import { getMovieStyles } from "../styles/movieStyles"
import { shareGameResult } from "../utils/shareUtils"
import { useTheme } from "../contexts/themeContext"
import GuessesContainer from "./guesses"

interface GameOverViewProps {
  playerGame: PlayerGame
  lastGuessResult: { movieId: number; correct: boolean } | null
}

const GameOverView: React.FC<GameOverViewProps> = ({
  playerGame,
  lastGuessResult,
}) => {
  const { colors } = useTheme()
  const movieStyles = useMemo(() => getMovieStyles(colors), [colors])
  const fadeAnimation = useSharedValue(0)
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    fadeAnimation.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    })
  }, [fadeAnimation])

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnimation.value,
    }
  })

  const handleShare = async () => {
    if (isSharing) return
    setIsSharing(true)
    try {
      await shareGameResult(playerGame)
    } catch (error) {
      console.error("Error during sharing process:", error)
      Alert.alert(
        "Sharing Failed",
        "An error occurred while trying to share your results."
      )
    } finally {
      setIsSharing(false)
    }
  }

  const resultTitle = playerGame.correctAnswer ? "You Got It!" : "So Close!"
  const resultMessage = playerGame.correctAnswer
    ? `You guessed it in ${playerGame.guesses.length} guess${
        playerGame.guesses.length > 1 ? "es" : ""
      }!`
    : playerGame.gaveUp
    ? "Sometimes you just know when to fold 'em."
    : "Better luck next time."

  return (
    <Animated.View style={[{ width: "100%" }, animatedContainerStyle]}>
      <View style={movieStyles.gameOverCard}>
        <ScrollView
          style={movieStyles.gameOverScrollView}
          contentContainerStyle={movieStyles.gameOverContentContainer}
        >
          <Text style={movieStyles.gameOverResultTitle}>{resultTitle}</Text>
          <Text style={movieStyles.gameOverSubText}>{resultMessage}</Text>

          <Facts movie={playerGame.movie} isScrollEnabled={false} />

          <View style={movieStyles.fullOverviewContainer}>
            <Text style={movieStyles.fullOverviewTitle}>The Full Plot</Text>
            <Text style={movieStyles.fullOverviewText}>
              {playerGame.movie.overview}
            </Text>
          </View>
        </ScrollView>
      </View>

      <GuessesContainer lastGuessResult={lastGuessResult} />

      <View style={movieStyles.gameOverButtonsContainer}>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            movieStyles.gameOverButton,
            (pressed || isSharing) && movieStyles.pressedButton,
            isSharing && movieStyles.disabledButton,
          ]}
          disabled={isSharing}
        >
          {isSharing ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={movieStyles.gameOverButtonText}>
              Share Your Result
            </Text>
          )}
        </Pressable>
      </View>

      <PersonalizedStatsMessage />
      <CountdownTimer />
    </Animated.View>
  )
}

export default GameOverView
