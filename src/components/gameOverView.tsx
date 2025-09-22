import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  View,
  Pressable,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"
import ViewShot from "react-native-view-shot"
import CountdownTimer from "./countdownTimer"
import Facts from "./facts"
import PersonalizedStatsMessage from "./personalizedStatsMessage"
import ShareCard from "./shareCard"
import { PlayerGame } from "../models/game"
import { getMovieStyles } from "../styles/movieStyles"
import { shareGameResultAsImage } from "../utils/shareUtils"
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
  const viewShotRef = useRef<ViewShot>(null)
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
    await shareGameResultAsImage(viewShotRef, playerGame)
    setIsSharing(false)
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
      <View style={styles.offscreenContainer}>
        <ViewShot
          ref={viewShotRef}
          options={{
            fileName: "talkie-trivia-result",
            format: "jpg",
            quality: 0.9,
            result: Platform.OS === "web" ? "data-uri" : "tmpfile",
          }}
        >
          <ShareCard playerGame={playerGame} />
        </ViewShot>
      </View>

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

const styles = StyleSheet.create({
  offscreenContainer: {
    position: "absolute",
    left: -9999,
  },
})

export default GameOverView
