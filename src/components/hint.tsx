import React, { memo, useMemo } from "react"
import { View, Text } from "react-native"
import Animated from "react-native-reanimated"
import { useHintLogic } from "../utils/hooks/useHintLogic"
import HintUI from "./hintUI"
import { getHintStyles } from "../styles/hintStyles"
import { useSkeletonAnimation } from "../utils/hooks/useSkeletonAnimation"
import { useGame } from "../contexts/gameContext"
import { useTheme } from "../contexts/themeContext"
import { HintType } from "../models/game"

const HintSkeleton = memo(() => {
  const { colors } = useTheme()
  const hintStyles = useMemo(() => getHintStyles(colors), [colors])
  const animatedStyle = useSkeletonAnimation()
  return (
    <View style={hintStyles.container}>
      <Animated.View style={[hintStyles.skeletonLabel, animatedStyle]} />
    </View>
  )
})

const VeryEasyHints = memo(() => {
  const { playerGame } = useGame()
  const { getHintText } = useHintLogic()
  const { colors } = useTheme()
  const styles = useMemo(() => getHintStyles(colors), [colors])

  const hintTypes: HintType[] = ["decade", "director", "actor", "genre"]

  return (
    <View style={styles.veryEasyContainer}>
      <Text style={styles.veryEasyTitle}>All Hints Revealed</Text>
      {hintTypes.map((type) => (
        <Text key={type} style={styles.veryEasyText}>
          <Text style={styles.veryEasyHintLabel}>
            {type.charAt(0).toUpperCase() + type.slice(1)}:{" "}
          </Text>
          {getHintText(type)}
        </Text>
      ))}
    </View>
  )
})

const HintContainer: React.FC = memo(() => {
  const {
    loading: isDataLoading,
    playerGame,
    isInteractionsDisabled,
    playerStats,
    difficulty,
  } = useGame()

  const {
    showHintOptions,
    displayedHintText,
    hintLabelText,
    isToggleDisabled,
    hintStatuses,
    highlightedHint,
    handleToggleHintOptions,
    handleHintSelection,
  } = useHintLogic()

  if (isDataLoading) {
    return <HintSkeleton />
  }

  if (difficulty === "hard" || difficulty === "very hard") {
    return null
  }

  if (difficulty === "very easy" && !isInteractionsDisabled) {
    return <VeryEasyHints />
  }

  if (
    difficulty === "medium" &&
    !Object.values(playerGame.hintsUsed || {}).some(Boolean)
  ) {
    const { colors } = useTheme()
    const hintStyles = useMemo(() => getHintStyles(colors), [colors])
    return (
      <View style={hintStyles.container}>
        <Text style={hintStyles.hintLabelDisabled}>{hintLabelText}</Text>
      </View>
    )
  }

  return (
    <HintUI
      showHintOptions={showHintOptions}
      displayedHintText={displayedHintText}
      hintLabelText={hintLabelText}
      isToggleDisabled={isToggleDisabled}
      hintsAvailable={playerStats?.hintsAvailable ?? 0}
      hintStatuses={hintStatuses}
      highlightedHint={highlightedHint}
      handleToggleHintOptions={handleToggleHintOptions}
      handleHintSelection={handleHintSelection}
    />
  )
})

export default HintContainer
