import React, { lazy, Suspense, useMemo } from "react"
import { ScrollView, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import LoadingIndicator from "../../components/loadingIndicator"
import { getMovieStyles } from "../../styles/movieStyles"
import { useTheme } from "../../contexts/themeContext"
import { useGameStore } from "../../state/gameStore"
import TitleHeader from "../../components/titleHeader"
import { spacing } from "../../styles/global"

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

  const { colors } = useTheme()
  const movieStyles = useMemo(() => getMovieStyles(colors), [colors])

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundLight]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={movieStyles.scrollContentContainer}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: spacing.medium,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            zIndex: 1,
          }}
        >
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

export default GameScreen
