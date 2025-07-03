import React, { memo } from "react"
import { View } from "react-native"
import Animated from "react-native-reanimated"
import { PlayerGame } from "../models/game"
import { useHintLogic } from "../utils/hooks/useHintLogic"
import HintUI from "./hintUI"
import PlayerStats from "../models/playerStats"
import { hintStyles } from "../styles/hintStyles"
import { useSkeletonAnimation } from "../utils/hooks/useSkeletonAnimation"

interface HintContainerProps {
  isLoading: boolean
  playerGame: PlayerGame
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  isInteractionsDisabled: boolean
  playerStats: PlayerStats
  updatePlayerStats: (updatedPlayerStats: any) => void
}

const HintSkeleton = memo(() => {
  const animatedStyle = useSkeletonAnimation()
  return (
    <View style={hintStyles.container}>
      <Animated.View style={[hintStyles.skeletonLabel, animatedStyle]} />
    </View>
  )
})

const HintContainer: React.FC<HintContainerProps> = memo(
  ({
    isLoading,
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
      hintStatuses,
      handleToggleHintOptions,
      handleHintSelection,
    } = useHintLogic({
      playerGame,
      isInteractionsDisabled,
      playerStats,
      updatePlayerGame,
      updatePlayerStats,
    })

    if (isLoading) {
      return <HintSkeleton />
    }

    return (
      <HintUI
        showHintOptions={showHintOptions}
        displayedHintText={displayedHintText}
        hintLabelText={hintLabelText}
        isToggleDisabled={isToggleDisabled}
        hintsAvailable={hintsAvailable}
        hintStatuses={hintStatuses}
        handleToggleHintOptions={handleToggleHintOptions}
        handleHintSelection={handleHintSelection}
      />
    )
  }
)

export default HintContainer
