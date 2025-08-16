import React, { lazy, Suspense, useMemo } from "react"
import { ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { getMovieStyles } from "../../styles/movieStyles"
import { useGame } from "../../contexts/gameContext"
import { useTheme } from "../../contexts/themeContext"

const GameplayContainer = lazy(
  () => import("../../components/gameplayContainer")
)
const ConfettiCelebration = lazy(
  () => import("../../components/confettiCelebration")
)
const OnboardingModal = lazy(() => import("../../components/onboardingModal"))

const GameScreen = () => {
  const {
    loading,
    error,
    showConfetti,
    handleConfettiStop,
    showOnboarding,
    handleDismissOnboarding,
  } = useGame()
  const { colors } = useTheme()
  const movieStyles = useMemo(() => getMovieStyles(colors), [colors])

  if (loading) {
    return <LoadingIndicator />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

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

      <Suspense fallback={null}>
        <OnboardingModal
          isVisible={showOnboarding}
          onDismiss={handleDismissOnboarding}
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
