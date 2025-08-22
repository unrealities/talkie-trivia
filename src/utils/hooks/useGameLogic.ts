import { useMemo } from "react"
import { useAnimatedStyle, withTiming } from "react-native-reanimated"
import { useAuth } from "../../contexts/authContext"
import { useGameSettings } from "./useGameSettings"
import { useGameData } from "./useGameData"
import { useGameManager } from "./useGameManager"

export function useGameLogic() {
  const { player, loading: authLoading } = useAuth()
  const { difficulty, setDifficulty, showOnboarding, handleDismissOnboarding } =
    useGameSettings()

  const {
    movies,
    basicMovies,
    initialPlayerGame,
    initialPlayerStats,
    loading: dataLoading,
    error: dataError,
  } = useGameData(player, difficulty)

  const {
    playerGame,
    dispatch,
    playerStats,
    updatePlayerStats,
    showModal,
    setShowModal,
    showConfetti,
    setShowConfetti,
    handleConfettiStop,
    persistenceError,
  } = useGameManager(initialPlayerGame, initialPlayerStats, player)

  const loading = authLoading || dataLoading
  const error = dataError || persistenceError

  const animatedModalStyles = useAnimatedStyle(() => ({
    opacity: withTiming(showModal ? 1 : 0, { duration: 300 }),
  }))

  const isInteractionsDisabled = useMemo(
    () =>
      loading ||
      playerGame.correctAnswer ||
      playerGame.gaveUp ||
      playerGame.guesses.length >= playerGame.guessesMax,
    [loading, playerGame]
  )

  return {
    player,
    playerGame,
    dispatch,
    playerStats,
    updatePlayerStats,
    loading,
    error,
    movies,
    basicMovies,
    showModal,
    setShowModal,
    showConfetti,
    setShowConfetti,
    handleConfettiStop,
    isInteractionsDisabled,
    animatedModalStyles,
    showOnboarding,
    handleDismissOnboarding,
    difficulty,
    setDifficulty,
  }
}
