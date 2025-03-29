import React, { memo } from "react"
import { PlayerGame } from "../models/game"
import { useHintLogic } from "../utils/hooks/useHintLogic"
import HintUI from "./hintUI"

interface HintContainerProps {
  playerGame: PlayerGame
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  isInteractionsDisabled: boolean
  hintsAvailable: number
  updatePlayerStats: (updatedPlayerStats: any) => void
}

const HintContainer: React.FC<HintContainerProps> = memo(
  ({
    playerGame,
    updatePlayerGame,
    isInteractionsDisabled,
    hintsAvailable,
    updatePlayerStats,
  }: HintContainerProps) => {
    const {
      showHintOptions,
      displayedHintText,
      hintLabelText,
      isToggleDisabled,
      areHintButtonsDisabled,
      handleToggleHintOptions,
      handleHintSelection,
    } = useHintLogic({
      playerGame,
      isInteractionsDisabled,
      hintsAvailable,
      updatePlayerGame,
      updatePlayerStats,
    })

    return (
      <HintUI
        showHintOptions={showHintOptions}
        displayedHintText={displayedHintText}
        hintLabelText={hintLabelText}
        isToggleDisabled={isToggleDisabled}
        areHintButtonsDisabled={areHintButtonsDisabled}
        hintsAvailable={hintsAvailable}
        handleToggleHintOptions={handleToggleHintOptions}
        handleHintSelection={handleHintSelection}
      />
    )
  }
)

export default HintContainer
