import React, { useState, useCallback, useEffect } from "react"
import { View, ScrollView } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import CluesContainer from "./clues"
import GuessesContainer from "./guesses"
import ConfettiCelebration from "./confettiCelebration"
import OnboardingModal from "./onboardingModal"
import GameplayView from "./gameplayView"
import GameOverView from "./gameOverView"
import { useGame } from "../contexts/gameContext"
import { movieStyles } from "../styles/movieStyles"

type GuessResult = { movieId: number; correct: boolean } | null

const GameUI: React.FC = () => {
  const {
    playerGame,
    showConfetti,
    showOnboarding,
    handleConfettiStop,
    handleDismissOnboarding,
  } = useGame()

  const [lastGuessResult, setLastGuessResult] = useState<GuessResult>(null)

  const isGameOver =
    playerGame.correctAnswer ||
    playerGame.gaveUp ||
    playerGame.guesses.length >= playerGame.guessesMax

  const gameOverAnimation = useSharedValue(isGameOver ? 1 : 0)

  useEffect(() => {
    gameOverAnimation.value = withTiming(isGameOver ? 1 : 0, { duration: 400 })
  }, [isGameOver, gameOverAnimation])

  const animatedGameplayStyle = useAnimatedStyle(() => ({
    opacity: 1 - gameOverAnimation.value,
    transform: [{ scale: 1 - gameOverAnimation.value * 0.05 }],
  }))
  const animatedGameOverStyle = useAnimatedStyle(() => ({
    opacity: gameOverAnimation.value,
    transform: [{ scale: 0.95 + gameOverAnimation.value * 0.05 }],
  }))

  const handleGuessMade = useCallback((result: GuessResult) => {
    setLastGuessResult(result)
  }, [])

  return (
    <ScrollView
      contentContainerStyle={movieStyles.scrollContentContainer}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={movieStyles.container}>
        <CluesContainer />
        {isGameOver ? (
          <Animated.View style={[{ width: "100%" }, animatedGameOverStyle]}>
            <GameOverView
              playerGame={playerGame}
              lastGuessResult={lastGuessResult}
            />
          </Animated.View>
        ) : (
          <Animated.View style={[{ width: "100%" }, animatedGameplayStyle]}>
            <GameplayView onGuessMade={handleGuessMade} />
            <GuessesContainer lastGuessResult={lastGuessResult} />
          </Animated.View>
        )}

        <OnboardingModal
          isVisible={showOnboarding}
          onDismiss={handleDismissOnboarding}
        />
        <ConfettiCelebration
          startConfetti={showConfetti}
          onConfettiStop={handleConfettiStop}
        />
      </View>
    </ScrollView>
  )
}

export default GameUI
