import React, { useState, useCallback } from "react"
import { View, ViewStyle } from "react-native"
import PickerContainer from "./picker"
import HintContainer from "./hint"
import ConfirmationModal from "./confirmationModal"
import { hapticsService } from "../utils/hapticsService"
import { useGameStore } from "../state/gameStore"
import { useShallow } from "zustand/react/shallow"
import { Button } from "./ui/button"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { u } from "../styles/utils"
import { GAME_MODE_CONFIG } from "../config/difficulty"

const GameplayView: React.FC = () => {
  const { giveUp, isInteractionsDisabled, gameMode } = useGameStore(
    useShallow((state) => ({
      giveUp: state.giveUp,
      isInteractionsDisabled: state.isInteractionsDisabled,
      gameMode: state.gameMode,
    }))
  )
  const styles = useStyles(themedStyles)

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

      <Button
        title="Give Up?"
        onPress={handleGiveUpPress}
        isLoading={isGivingUp}
        disabled={isInteractionsDisabled}
        variant="error"
        style={[u.wFull, styles.giveUpButton]}
        testID="give-up-button"
      />

      <ConfirmationModal
        isVisible={showGiveUpConfirmation}
        title="Give Up?"
        message={GAME_MODE_CONFIG[gameMode].giveUpConfirmation}
        confirmText="Give Up"
        cancelText="Cancel"
        onConfirm={confirmGiveUp}
        onCancel={cancelGiveUp}
      />
    </>
  )
}

interface GameplayViewStyles {
  giveUpButton: ViewStyle
}

const themedStyles = (theme: Theme): GameplayViewStyles => ({
  giveUpButton: {
    backgroundColor: theme.colors.error,
  },
})

export default GameplayView
