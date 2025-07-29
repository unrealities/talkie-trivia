import React, { useState, useCallback, useEffect } from "react"
import { View, Pressable, Text, ScrollView, Share, Alert } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import CluesContainer from "./clues"
import GuessesContainer from "./guesses"
import PickerContainer from "./picker"
import HintContainer from "./hint"
import ConfettiCelebration from "./confettiCelebration"
import ConfirmationModal from "./confirmationModal"
import OnboardingModal from "./onboardingModal"
import Facts from "./facts"
import GuessFeedback from "./guessFeedback"
import { useGame } from "../contexts/gameContext"
import { hapticsService } from "../utils/hapticsService"
import { analyticsService } from "../utils/analyticsService"
import { generateShareMessage } from "../utils/shareUtils"
import { movieStyles } from "../styles/movieStyles"

type GuessResult = { movieId: number; correct: boolean } | null

const GameUI: React.FC = () => {
  const {
    loading: isDataLoading,
    playerGame,
    updatePlayerGame,
    showConfetti,
    showOnboarding,
    handleConfettiStop,
    setShowConfetti,
    handleDismissOnboarding,
  } = useGame()

  const [lastGuessResult, setLastGuessResult] = useState<GuessResult>(null)
  const [showGiveUpConfirmation, setShowGiveUpConfirmation] = useState(false)
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null)
  const [isCorrectGuess, setIsCorrectGuess] = useState<boolean | null>(null)

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
  }))
  const animatedGameOverStyle = useAnimatedStyle(() => ({
    opacity: gameOverAnimation.value,
  }))

  const handleGuessMade = useCallback(
    (result: { movieId: number; correct: boolean }) => {
      setLastGuessResult(result)
      setIsCorrectGuess(result.correct)
      if (result.correct) {
        setGuessFeedback("Correct!")
        setShowConfetti(true)
        hapticsService.success()
      } else {
        setGuessFeedback("Not quite! Try again.")
        hapticsService.error()
      }
    },
    [setShowConfetti]
  )

  useEffect(() => {
    setGuessFeedback(null)
    setIsCorrectGuess(null)
  }, [playerGame.guesses.length])

  const handleGiveUpPress = useCallback(() => {
    hapticsService.warning()
    setShowGiveUpConfirmation(true)
  }, [])

  const cancelGiveUp = useCallback(() => setShowGiveUpConfirmation(false), [])

  const confirmGiveUp = useCallback(() => {
    setShowGiveUpConfirmation(false)
    if (playerGame && !playerGame.correctAnswer) {
      analyticsService.trackGameGiveUp(
        playerGame.guesses.length,
        Object.keys(playerGame.hintsUsed || {}).length
      )
      updatePlayerGame({ ...playerGame, gaveUp: true })
    }
  }, [playerGame, updatePlayerGame])

  const handleShare = async () => {
    if (!playerGame) return
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

  const GameplayContent = () => (
    <Animated.View style={animatedGameplayStyle}>
      <GuessFeedback message={guessFeedback} isCorrect={isCorrectGuess} />
      <HintContainer provideGuessFeedback={setGuessFeedback} />
      <PickerContainer onGuessMade={handleGuessMade} />
      <GuessesContainer lastGuessResult={lastGuessResult} />
      <Pressable
        onPress={handleGiveUpPress}
        style={({ pressed }) => [
          movieStyles.giveUpButton,
          isDataLoading && movieStyles.disabledButton,
          pressed && movieStyles.pressedButton,
        ]}
        disabled={isDataLoading}
      >
        <Text style={movieStyles.giveUpButtonText}>Give Up?</Text>
      </Pressable>
    </Animated.View>
  )

  const GameOverContent = () => (
    <Animated.View style={animatedGameOverStyle}>
      <Text style={movieStyles.gameOverSubText}>
        {playerGame.correctAnswer
          ? `You got it in ${playerGame.guesses.length} guess${
              playerGame.guesses.length > 1 ? "es" : ""
            }!`
          : playerGame.gaveUp
          ? "Sometimes you just know when to fold 'em."
          : "So close! Better luck next time."}
      </Text>
      <Facts movie={playerGame.movie} isScrollEnabled={false} />
      <GuessesContainer lastGuessResult={lastGuessResult} />
      <View style={movieStyles.gameOverButtonsContainer}>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            movieStyles.shareButton,
            pressed && movieStyles.pressedButton,
          ]}
        >
          <Text style={movieStyles.detailsButtonText}>Share Your Result</Text>
        </Pressable>
      </View>
      <Text style={movieStyles.comeBackText}>
        Come back tomorrow for a new movie!
      </Text>
    </Animated.View>
  )

  return (
    <ScrollView
      contentContainerStyle={movieStyles.scrollContentContainer}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={movieStyles.container}>
        <CluesContainer />
        {isGameOver ? <GameOverContent /> : <GameplayContent />}

        <OnboardingModal
          isVisible={showOnboarding}
          onDismiss={handleDismissOnboarding}
        />
        <ConfettiCelebration
          startConfetti={showConfetti}
          onConfettiStop={handleConfettiStop}
        />
        <ConfirmationModal
          isVisible={showGiveUpConfirmation}
          title="Give Up?"
          message="Are you sure you want to give up?"
          confirmText="Give Up"
          cancelText="Cancel"
          onConfirm={confirmGiveUp}
          onCancel={cancelGiveUp}
        />
      </View>
    </ScrollView>
  )
}

export default GameUI
