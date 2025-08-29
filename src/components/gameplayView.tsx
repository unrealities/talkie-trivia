import React, { useState, useCallback, useMemo } from "react"
import { Pressable, Text } from "react-native"
import PickerContainer from "./picker"
import HintContainer from "./hint"
import ConfirmationModal from "./confirmationModal"
import { hapticsService } from "../utils/hapticsService"
import { getMovieStyles } from "../styles/movieStyles"
import { useTheme } from "../contexts/themeContext"
import { useGameStore } from "../state/gameStore"

const GameplayView: React.FC = () => {
  const { giveUp, isInteractionsDisabled } = useGameStore((state) => ({
    giveUp: state.giveUp,
    isInteractionsDisabled: state.isInteractionsDisabled,
  }))
  const { colors } = useTheme()
  const movieStyles = useMemo(() => getMovieStyles(colors), [colors])

  const [showGiveUpConfirmation, setShowGiveUpConfirmation] = useState(false)

  const handleGiveUpPress = useCallback(() => {
    hapticsService.warning()
    setShowGiveUpConfirmation(true)
  }, [])

  const cancelGiveUp = useCallback(() => setShowGiveUpConfirmation(false), [])

  const confirmGiveUp = useCallback(() => {
    setShowGiveUpConfirmation(false)
    giveUp()
  }, [giveUp])

  return (
    <>
      <HintContainer />
      <PickerContainer />
      <Pressable
        onPress={handleGiveUpPress}
        style={({ pressed }) => [
          movieStyles.giveUpButton,
          isInteractionsDisabled && movieStyles.disabledButton,
          pressed && movieStyles.pressedButton,
        ]}
        disabled={isInteractionsDisabled}
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
