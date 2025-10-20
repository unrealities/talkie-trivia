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
import { DIFFICULTY_MODES } from "../config/difficulty"
import { useShallow } from "zustand/react/shallow"

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

const BasicHints = memo(() => {
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
            {type.charAt(0).toUpperCase() + type.slice(1)}:
          </Text>
          <Text style={styles.veryEasyHintValue}>{getHintText(type)}</Text>
        </View>
      ))}
    </View>
  )
})

const MainHintComponent = () => {
  const { playerGame, difficulty, playerStats } = useGameStore(
    useShallow((state) => ({
      playerGame: state.playerGame,
      difficulty: state.difficulty,
      playerStats: state.playerStats,
    }))
  )

  const currentHintStrategy = DIFFICULTY_MODES[difficulty].hintStrategy

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

  if (currentHintStrategy === "IMPLICIT_FEEDBACK") {
    return (
      <View style={hintStyles.container}>
        <Text style={hintStyles.hintLabelDisabled}>{hintLabelText}</Text>
      </View>
    )
  }

  const isNonInteractiveStrategy =
    currentHintStrategy === "NONE_DISABLED" ||
    currentHintStrategy === "EXTREME_CHALLENGE"

  if (isNonInteractiveStrategy) {
    return null
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

  const currentStrategy = loading
    ? null
    : DIFFICULTY_MODES[difficulty]?.hintStrategy

  if (loading) {
    return <HintSkeleton />
  }

  // Render the BasicHints component if the strategy is ALL_REVEALED or HINTS_ONLY_REVEALED.
  if (
    (currentStrategy === "ALL_REVEALED" ||
      currentStrategy === "HINTS_ONLY_REVEALED") &&
    !isInteractionsDisabled
  ) {
    return <BasicHints />
  }

  return <MainHintComponent />
})

export default HintContainer
