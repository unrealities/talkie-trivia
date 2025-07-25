import React, { useState, useCallback, useEffect } from "react"
import { View, Pressable, Text, ScrollView } from "react-native"
import Animated from "react-native-reanimated"

import CluesContainer from "./clues"
import GuessesContainer from "./guesses"
import NetworkContainer from "./network"
import MovieModal from "./modal"
import PickerContainer from "./picker"
import { movieStyles } from "../styles/movieStyles"
import HintContainer from "./hint"
import ConfettiCelebration from "./confettiCelebration"
import ConfirmationModal from "./confirmationModal"
import { useGame } from "../contexts/gameContext"
import { useNetwork } from "../contexts/networkContext"
import OnboardingModal from "./onboardingModal"
import { hapticsService } from "../utils/hapticsService"
import { analyticsService } from "../utils/analyticsService"

type GuessResult = { movieId: number; correct: boolean } | null

const GameUI: React.FC = () => {
  const {
    loading: isDataLoading,
    playerGame,
    updatePlayerGame,
    showModal,
    showConfetti,
    isInteractionsDisabled,
    animatedModalStyles,
    showOnboarding,
    handleConfettiStop,
    setShowModal,
    setShowConfetti,
    handleDismissOnboarding,
  } = useGame()
  const { isNetworkConnected } = useNetwork()

  const [lastGuessResult, setLastGuessResult] = useState<GuessResult>(null)
  const [showGiveUpConfirmation, setShowGiveUpConfirmation] = useState(false)

  useEffect(() => {
    setLastGuessResult(null)
  }, [playerGame.guesses.length])

  const handleGuessMade = useCallback(
    (result: { movieId: number; correct: boolean }) => {
      setLastGuessResult(result)
      if (result.correct) {
        setShowConfetti(true)
        hapticsService.success()
      } else {
        hapticsService.error()
      }
    },
    [setShowConfetti]
  )

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

  const isGameOver =
    playerGame.correctAnswer ||
    playerGame.gaveUp ||
    playerGame.guesses.length >= playerGame.guessesMax

  return (
    <ScrollView
      contentContainerStyle={movieStyles.scrollContentContainer}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={movieStyles.container}>
        <NetworkContainer isConnected={isNetworkConnected || false} />
        <CluesContainer />
        <HintContainer provideGuessFeedback={() => {}} />
        <PickerContainer onGuessMade={handleGuessMade} />
        <GuessesContainer lastGuessResult={lastGuessResult} />

        <Pressable
          onPress={handleGiveUpPress}
          style={({ pressed }) => [
            movieStyles.giveUpButton,
            (isInteractionsDisabled || isDataLoading) &&
              movieStyles.disabledButton,
            pressed && movieStyles.pressedButton,
          ]}
          disabled={isInteractionsDisabled || isDataLoading}
          accessible={true}
          accessibilityLabel="Give Up"
          accessibilityHint="Gives up on the current movie."
          accessibilityRole="button"
        >
          <Text style={movieStyles.giveUpButtonText}>Give Up?</Text>
        </Pressable>

        <Animated.View style={[animatedModalStyles]}>
          <MovieModal
            playerGame={isGameOver ? playerGame : null}
            show={showModal}
            toggleModal={setShowModal}
          />
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
