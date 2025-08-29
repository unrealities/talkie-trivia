import React, { useEffect, useMemo, useRef } from "react"
import { View, Pressable, Text, ScrollView, StyleSheet } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
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
  const flipAnimation = useSharedValue(0)
  const viewShotRef = useRef<ViewShot>(null)

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

  const handleShare = () => {
    shareGameResultAsImage(viewShotRef, playerGame)
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
      <View style={styles.offscreenContainer}>
        <ViewShot
          ref={viewShotRef}
          options={{
            fileName: "talkie-trivia-result",
            format: "jpg",
            quality: 0.9,
          }}
        >
          <ShareCard playerGame={playerGame} />
        </ViewShot>
      </View>

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

      <PersonalizedStatsMessage />
      <CountdownTimer />
    </View>
  )
}

const styles = StyleSheet.create({
  offscreenContainer: {
    position: "absolute",
    left: -9999,
  },
})

export default GameOverView
