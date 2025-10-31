import React, { useEffect } from "react"
import { ScrollView, TextStyle, ViewStyle } from "react-native"
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
import GuessesContainer from "./guesses"
import FullPlotSection from "./gameOver/fullPlotSection"
import ShareResultButton from "./gameOver/shareResultButton"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { Card } from "./ui/card"
import { Typography } from "./ui/typography"

interface GameOverViewProps {
  playerGame: PlayerGame
  lastGuessResult: { movieId: number; correct: boolean } | null
}

const GameOverView: React.FC<GameOverViewProps> = ({
  playerGame,
  lastGuessResult,
}) => {
  const styles = useStyles(themedStyles)
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
      <Card style={styles.card}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <Typography variant="h2" style={styles.resultTitle}>
            {resultTitle}
          </Typography>
          <Typography variant="body" style={styles.subText}>
            {resultMessage}
          </Typography>

          <Facts movie={playerGame.movie} isScrollEnabled={false} />

          <FullPlotSection overview={playerGame.movie.overview} />
        </ScrollView>
      </Card>

      <GuessesContainer lastGuessResult={lastGuessResult} />
      <ShareResultButton playerGame={playerGame} />
      <PersonalizedStatsMessage />
      <CountdownTimer />
    </Animated.View>
  )
}

interface GameOverStyles {
  card: ViewStyle
  scrollView: ViewStyle
  scrollContentContainer: ViewStyle
  resultTitle: TextStyle
  subText: TextStyle
}

const themedStyles = (theme: Theme): GameOverStyles => ({
  card: {
    width: "100%",
    marginVertical: theme.spacing.medium,
    overflow: "hidden",
    backfaceVisibility: "hidden",
  },
  scrollView: {
    maxHeight: theme.responsive.screenHeight * 0.5,
  },
  scrollContentContainer: {
    padding: theme.spacing.large,
    alignItems: "center",
  },
  resultTitle: {
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: theme.spacing.extraSmall,
  },
  subText: {
    fontFamily: "Arvo-Italic",
    textAlign: "center",
    marginBottom: theme.spacing.large,
  },
})

export default GameOverView
