import React, { useState, useCallback, useMemo } from "react"
import { Pressable, Text, ActivityIndicator } from "react-native"
import PickerContainer from "./picker"
import HintContainer from "./hint"
import ConfirmationModal from "./confirmationModal"
import { hapticsService } from "../utils/hapticsService"
import { getMovieStyles } from "../styles/movieStyles"
import { useTheme } from "../contexts/themeContext"
import { useGameStore } from "../state/gameStore"
import { useShallow } from "zustand/react/shallow"

const GameplayView: React.FC = () => {
  const { giveUp, isInteractionsDisabled } = useGameStore(
    useShallow((state) => ({
      giveUp: state.giveUp,
      isInteractionsDisabled: state.isInteractionsDisabled,
    }))
  )

  const { colors } = useTheme()
  const movieStyles = useMemo(() => getMovieStyles(colors), [colors])

  const [showGiveUpConfirmation, setShowGiveUpConfirmation] = useState(false)
  const [isGivingUp, setIsGivingUp] = useState(false)
  const handleGiveUpPress = useCallback(() => {
    hapticsService.warning()
    setShowGiveUpConfirmation(true)
  }, [])

  const cancelGiveUp = useCallback(() => setShowGiveUpConfirmation(false), [])

  const confirmGiveUp = useCallback(() => {
    setShowGiveUpConfirmation(false)
    setIsGivingUp(true)
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
          (isInteractionsDisabled || isGivingUp) && movieStyles.disabledButton,
          pressed && movieStyles.pressedButton,
        ]}
        disabled={isInteractionsDisabled || isGivingUp}
      >
        {isGivingUp ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={movieStyles.giveUpButtonText}>Give Up?</Text>
        )}
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
