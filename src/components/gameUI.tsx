import React, { useState, useCallback, useEffect } from "react"
import { View, Pressable, Text, ScrollView } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated"
import { Image } from "expo-image"

import CluesContainer from "./clues"
import GuessesContainer from "./guesses"
import MovieModal from "./modal"
import PickerContainer from "./picker"
import { movieStyles } from "../styles/movieStyles"
import HintContainer from "./hint"
import ConfettiCelebration from "./confettiCelebration"
import ConfirmationModal from "./confirmationModal"
import { useGame } from "../contexts/gameContext"
import OnboardingModal from "./onboardingModal"
import { hapticsService } from "../utils/hapticsService"
import { analyticsService } from "../utils/analyticsService"
import GuessFeedback from "./guessFeedback"
import Facts from "./facts"

type GuessResult = { movieId: number; correct: boolean } | null

const GameUI: React.FC = () => {
  const {
    loading: isDataLoading,
    playerGame,
    updatePlayerGame,
    showModal,
    showConfetti,
    animatedModalStyles,
    showOnboarding,
    handleConfettiStop,
    setShowModal,
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

  const gameplayOpacity = useSharedValue(isGameOver ? 0 : 1)
  const gameOverOpacity = useSharedValue(isGameOver ? 1 : 0)

  const animatedGameplayStyle = useAnimatedStyle(() => ({
    opacity: gameplayOpacity.value,
  }))
  const animatedGameOverStyle = useAnimatedStyle(() => ({
    opacity: gameOverOpacity.value,
    pointerEvents: gameOverOpacity.value === 1 ? "auto" : "none",
  }))

  useEffect(() => {
    if (isGameOver) {
      gameplayOpacity.value = withDelay(200, withTiming(0, { duration: 400 }))
      gameOverOpacity.value = withDelay(400, withTiming(1, { duration: 500 }))
    }
  }, [isGameOver, gameplayOpacity, gameOverOpacity])

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

  const cancelGiveUp = useCallback(() => {
    setShowGiveUpConfirmation(false)
  }, [])

  const confirmGiveUp = useCallback(() => {
    setShowGiveUpConfirmation(false)
    if (playerGame && !playerGame.correctAnswer) {
      analyticsService.trackGameGiveUp(
        playerGame.guesses.length,
        Object.keys(playerGame.hintsUsed || {}).length
      )
      const updatedPlayerGameGiveUp = { ...playerGame, gaveUp: true }
      updatePlayerGame(updatedPlayerGameGiveUp)
    }
  }, [playerGame, updatePlayerGame])

  const handleShowDetails = () => {
    hapticsService.light()
    setShowModal(true)
  }

  const renderGameResult = () => {
    let resultText = ""
    if (playerGame.correctAnswer) {
      resultText = `You got it in ${playerGame.guesses.length} guess${
        playerGame.guesses.length > 1 ? "es" : ""
      }!`
    } else if (playerGame.gaveUp) {
      resultText = "Sometimes you just know when to fold 'em."
    } else {
      resultText = "So close! Better luck next time."
    }
    return <Text style={movieStyles.gameOverSubText}>{resultText}</Text>
  }

  return (
    <ScrollView
      contentContainerStyle={movieStyles.scrollContentContainer}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={movieStyles.container}>
        <CluesContainer />

        {/* --- Gameplay View --- */}
        <Animated.View
          style={[movieStyles.gameplayContainer, animatedGameplayStyle]}
        >
          <GuessFeedback message={guessFeedback} isCorrect={isCorrectGuess} />
          <HintContainer provideGuessFeedback={setGuessFeedback} />
          <PickerContainer onGuessMade={handleGuessMade} />
          <Pressable
            onPress={handleGiveUpPress}
            style={({ pressed }) => [
              movieStyles.giveUpButton,
              isDataLoading && movieStyles.disabledButton,
              pressed && movieStyles.pressedButton,
            ]}
            disabled={isDataLoading}
            accessible={true}
            accessibilityLabel="Give Up"
            accessibilityHint="Gives up on the current movie."
            accessibilityRole="button"
          >
            <Text style={movieStyles.giveUpButtonText}>Give Up?</Text>
          </Pressable>
        </Animated.View>

        <GuessesContainer lastGuessResult={lastGuessResult} />

        {/* --- Game Over View --- */}
        {isGameOver && (
          <Animated.View
            style={[movieStyles.gameOverContainer, animatedGameOverStyle]}
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${playerGame.movie.poster_path}`,
              }}
              style={movieStyles.gameOverPoster}
              contentFit="contain"
            />
            <Text style={movieStyles.gameOverTitle}>
              {playerGame.movie.title}
            </Text>
            {renderGameResult()}
            <Pressable
              onPress={handleShowDetails}
              style={({ pressed }) => [
                movieStyles.detailsButton,
                pressed && movieStyles.pressedButton,
              ]}
            >
              <Text style={movieStyles.detailsButtonText}>
                View Details & Share
              </Text>
            </Pressable>
            <Text style={movieStyles.comeBackText}>
              Come back tomorrow for a new movie!
            </Text>
          </Animated.View>
        )}

        <Animated.View style={[animatedModalStyles]}>
          <MovieModal show={showModal} toggleModal={setShowModal}>
            <Facts movie={playerGame.movie} />
          </MovieModal>
        </Animated.View>

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
