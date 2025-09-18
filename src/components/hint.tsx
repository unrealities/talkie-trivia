import React, { memo, useMemo } from "react"
import { View, Text } from "react-native"
import Animated from "react-native-reanimated"
import { useHintLogic } from "../utils/hooks/useHintLogic"
import HintUI from "./hintUI"
import { getHintStyles } from "../styles/hintStyles"
import { useSkeletonAnimation } from "../utils/hooks/useSkeletonAnimation"
import { useGameStore } from "../state/gameStore"
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
  const { getHintText } = useHintLogic()
  const { colors } = useTheme()
  const styles = useMemo(() => getHintStyles(colors), [colors])

  const hintTypes: HintType[] = ["decade", "director", "actor", "genre"]

  return (
    <View style={styles.veryEasyContainer}>
      <Text style={styles.veryEasyTitle}>All Hints Revealed</Text>
      {hintTypes.map((type) => (
        <View key={type} style={styles.veryEasyRow}>
          <Text style={styles.veryEasyHintLabel}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
          <Text style={styles.veryEasyHintValue}>{getHintText(type)}</Text>
        </View>
      ))}
    </View>
  )
})

const MainHintComponent = () => {
  const playerGame = useGameStore((state) => state.playerGame)
  const playerStats = useGameStore((state) => state.playerStats)
  const difficulty = useGameStore((state) => state.difficulty)
  const { colors } = useTheme()
  const hintStyles = useMemo(() => getHintStyles(colors), [colors])
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

  if (
    difficulty === "medium" &&
    !Object.values(playerGame.hintsUsed || {}).some(Boolean)
  ) {
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
}

const HintContainer: React.FC = memo(() => {
  const loading = useGameStore((state) => state.loading)
  const isInteractionsDisabled = useGameStore(
    (state) => state.isInteractionsDisabled
  )
  const difficulty = useGameStore((state) => state.difficulty)

  if (loading) {
    return <HintSkeleton />
  }

  if (difficulty === "hard" || difficulty === "very hard") {
    return null
  }

  if (difficulty === "very easy" && !isInteractionsDisabled) {
    return <VeryEasyHints />
  }

  return <MainHintComponent />
})

export default HintContainer
