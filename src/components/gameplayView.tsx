import React, { useState, useCallback, useEffect } from "react"
import { View, Pressable, Text } from "react-native"
import PickerContainer from "./picker"
import HintContainer from "./hint"
import ConfirmationModal from "./confirmationModal"
import GuessFeedback from "./guessFeedback"
import { useGame } from "../contexts/gameContext"
import { hapticsService } from "../utils/hapticsService"
import { analyticsService } from "../utils/analyticsService"
import { movieStyles } from "../styles/movieStyles"

interface GameplayViewProps {
  onGuessMade: (result: { movieId: number; correct: boolean }) => void
}

const GameplayView: React.FC<GameplayViewProps> = ({ onGuessMade }) => {
  const {
    loading: isDataLoading,
    playerGame,
    updatePlayerGame,
    setShowConfetti,
  } = useGame()

  const [showGiveUpConfirmation, setShowGiveUpConfirmation] = useState(false)
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null)
  const [isCorrectGuess, setIsCorrectGuess] = useState<boolean | null>(null)

  const handleLocalGuessMade = useCallback(
    (result: { movieId: number; correct: boolean }) => {
      onGuessMade(result) // Pass the result up to the parent
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
    [onGuessMade, setShowConfetti]
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

  return (
    <>
      <GuessFeedback message={guessFeedback} isCorrect={isCorrectGuess} />
      <HintContainer provideGuessFeedback={setGuessFeedback} />
      <PickerContainer onGuessMade={handleLocalGuessMade} />
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
      <ConfirmationModal
        isVisible={showGiveUpConfirmation}
        title="Give Up?"
        message="Are you sure you want to give up?"
        confirmText="Give Up"
        cancelText="Cancel"
        onConfirm={confirmGiveUp}
        onCancel={cancelGiveUp}
      />
    </>
  )
}

export default GameplayView
