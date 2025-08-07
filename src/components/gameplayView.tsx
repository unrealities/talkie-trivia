import React, { useState, useCallback, useMemo } from "react"
import { View, Pressable, Text } from "react-native"
import PickerContainer from "./picker"
import HintContainer from "./hint"
import ConfirmationModal from "./confirmationModal"
import { useGame } from "../contexts/gameContext"
import { hapticsService } from "../utils/hapticsService"
import { analyticsService } from "../utils/analyticsService"
import { getMovieStyles } from "../styles/movieStyles"
import { useTheme } from "../contexts/themeContext"

interface GameplayViewProps {
  onGuessMade: (result: { movieId: number; correct: boolean }) => void
}

const GameplayView: React.FC<GameplayViewProps> = ({ onGuessMade }) => {
  const {
    loading: isDataLoading,
    playerGame,
    setShowConfetti,
    dispatch,
  } = useGame()
  const { colors } = useTheme()
  const movieStyles = useMemo(() => getMovieStyles(colors), [colors])

  const [showGiveUpConfirmation, setShowGiveUpConfirmation] = useState(false)

  const handleLocalGuessMade = useCallback(
    (result: { movieId: number; correct: boolean }) => {
      onGuessMade(result)
      if (result.correct) {
        setShowConfetti(true)
        hapticsService.success()
      } else {
        hapticsService.error()
      }
    },
    [onGuessMade, setShowConfetti]
  )

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

      dispatch({ type: "GIVE_UP" })
    }
  }, [playerGame, dispatch])

  return (
    <>
      <HintContainer />
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
