import React, { lazy, Suspense } from "react"
import { ScrollView, View, ViewStyle } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import LoadingIndicator from "../../components/loadingIndicator"
import { useTheme } from "../../contexts/themeContext"
import { useGameStore } from "../../state/gameStore"
import TitleHeader from "../../components/titleHeader"
import { useStyles, Theme } from "../../utils/hooks/useStyles"
import { u } from "../../styles/utils"

const GameplayContainer = lazy(
  () => import("../../components/gameplayContainer")
)
const ConfettiCelebration = lazy(
  () => import("../../components/confettiCelebration")
)
const FlashMessages = lazy(() => import("../../components/flashMessages"))
const GameDifficultyToggle = lazy(
  () => import("../../components/gameDifficultyToggle")
)

const GameScreen = () => {
  const showConfetti = useGameStore((state) => state.showConfetti)
  const handleConfettiStop = useGameStore((state) => state.handleConfettiStop)
  const flashMessage = useGameStore((state) => state.flashMessage)

  const { colors } = useTheme() // Still needed for LinearGradient
  const styles = useStyles(themedStyles)

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundLight]}
      style={u.flex}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        style={u.flex}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <TitleHeader />
          <Suspense fallback={null}>
            <GameDifficultyToggle />
          </Suspense>
        </View>

        <Suspense fallback={<LoadingIndicator />}>
          <GameplayContainer />
        </Suspense>
        <Suspense fallback={null}>
          <FlashMessages message={flashMessage} />
          <ConfettiCelebration
            startConfetti={showConfetti}
            onConfettiStop={handleConfettiStop}
          />
        </Suspense>
      </ScrollView>
    </LinearGradient>
  )
}

interface GameScreenStyles {
  scrollContentContainer: ViewStyle
  headerContainer: ViewStyle
}

const themedStyles = (theme: Theme): GameScreenStyles => ({
  scrollContentContainer: {
    paddingTop: theme.spacing.large,
    paddingBottom: theme.spacing.extraLarge,
    alignItems: "center",
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: theme.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    zIndex: 1,
  },
})

export default GameScreen
