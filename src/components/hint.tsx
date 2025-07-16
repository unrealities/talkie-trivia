import React, { memo } from "react"
import { View } from "react-native"
import Animated from "react-native-reanimated"
import { useHintLogic } from "../utils/hooks/useHintLogic"
import HintUI from "./hintUI"
import { hintStyles } from "../styles/hintStyles"
import { useSkeletonAnimation } from "../utils/hooks/useSkeletonAnimation"
import { useGameplay } from "../contexts/gameplayContext"

const HintSkeleton = memo(() => {
  const animatedStyle = useSkeletonAnimation()
  return (
    <View style={hintStyles.container}>
      <Animated.View style={[hintStyles.skeletonLabel, animatedStyle]} />
    </View>
  )
})

const HintContainer: React.FC = memo(() => {
  const {
    isDataLoading,
    playerGame,
    updatePlayerGame,
    isInteractionsDisabled,
    playerStats,
    updatePlayerStats,
  } = useGameplay()

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

  if (isDataLoading) {
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
})

export default HintContainer
