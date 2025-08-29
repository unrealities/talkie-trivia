import React, { lazy, Suspense, useMemo } from "react"
import { ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import LoadingIndicator from "../../components/loadingIndicator"
import { getMovieStyles } from "../../styles/movieStyles"
import { useTheme } from "../../contexts/themeContext"
import { useGameStore } from "../../state/gameStore"

const GameplayContainer = lazy(
  () => import("../../components/gameplayContainer")
)
const ConfettiCelebration = lazy(
  () => import("../../components/confettiCelebration")
)
const OnboardingModal = lazy(() => import("../../components/onboardingModal"))
const FlashMessages = lazy(() => import("../../components/flashMessages"))

const GameScreen = () => {
  const showConfetti = useGameStore((state) => state.showConfetti)
  const handleConfettiStop = useGameStore((state) => state.handleConfettiStop)
  const showOnboarding = useGameStore((state) => state.showOnboarding)
  const dismissOnboarding = useGameStore((state) => state.dismissOnboarding)
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
      >
        <Suspense fallback={<LoadingIndicator />}>
          <GameplayContainer />
        </Suspense>
      </ScrollView>

      {/* Overlays */}
      <Suspense fallback={null}>
        <FlashMessages message={flashMessage} />
        <OnboardingModal
          isVisible={showOnboarding}
          onDismiss={dismissOnboarding}
        />
        <ConfettiCelebration
          startConfetti={showConfetti}
          onConfettiStop={handleConfettiStop}
        />
      </Suspense>
    </LinearGradient>
  )
}

export default GameScreen
