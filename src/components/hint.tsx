import React, { memo } from "react"
import { PlayerGame } from "../models/game"
import { useHintLogic } from "../utils/hooks/useHintLogic"
import HintUI from "./hintUI"
import PlayerStats from "../models/playerStats"

interface HintContainerProps {
  playerGame: PlayerGame
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  isInteractionsDisabled: boolean
  playerStats: PlayerStats
  updatePlayerStats: (updatedPlayerStats: any) => void
}

const HintContainer: React.FC<HintContainerProps> = memo(
  ({
    playerGame,
    updatePlayerGame,
    isInteractionsDisabled,
    playerStats,
    updatePlayerStats,
  }: HintContainerProps) => {
    const hintsAvailable = playerStats?.hintsAvailable ?? 0

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
      playerStats,
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
