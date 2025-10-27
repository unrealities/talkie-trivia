import React, { useEffect, useMemo } from "react"
import { View, Text, ScrollView } from "react-native"
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
import { useTheme } from "../contexts/themeContext"
import GuessesContainer from "./guesses"
import FullPlotSection from "./gameOver/fullPlotSection"
import ShareResultButton from "./gameOver/shareResultButton"

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

          <FullPlotSection overview={playerGame.movie.overview} />
        </ScrollView>
      </View>

      <GuessesContainer lastGuessResult={lastGuessResult} />

      <ShareResultButton playerGame={playerGame} />

      <PersonalizedStatsMessage />
      <CountdownTimer />
    </Animated.View>
  )
}

export default GameOverView
