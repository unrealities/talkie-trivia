import React, { useEffect, useMemo } from "react"
import { View, Pressable, Text, Share, Alert, ScrollView } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated"
import GuessesContainer from "./guesses"
import CountdownTimer from "./countdownTimer"
import Facts from "./facts"
import { PlayerGame } from "../models/game"
import { getMovieStyles } from "../styles/movieStyles"
import { generateShareMessage } from "../utils/shareUtils"
import { hapticsService } from "../utils/hapticsService"
import { analyticsService } from "../utils/analyticsService"
import { useTheme } from "../contexts/themeContext"

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
  const flipAnimation = useSharedValue(0)

  useEffect(() => {
    flipAnimation.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.poly(4)),
    })
  }, [flipAnimation])

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [-180, 0])
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity: flipAnimation.value,
    }
  })

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

  const resultTitle = playerGame.correctAnswer ? "You Got It!" : "So Close!"
  const resultMessage = playerGame.correctAnswer
    ? `You guessed it in ${playerGame.guesses.length} guess${
        playerGame.guesses.length > 1 ? "es" : ""
      }!`
    : playerGame.gaveUp
    ? "Sometimes you just know when to fold 'em."
    : "Better luck next time."

  return (
    <View style={{ width: "100%" }}>
      <Animated.View style={[movieStyles.gameOverCard, animatedCardStyle]}>
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
      </Animated.View>

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

      <CountdownTimer />

      <Text style={movieStyles.comeBackText}>
        Come back tomorrow for a new movie!
      </Text>
    </View>
  )
}

export default GameOverView
