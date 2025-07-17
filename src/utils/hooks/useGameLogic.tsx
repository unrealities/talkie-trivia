import { useState, useCallback, useEffect } from "react"
import { useGameData } from "../../contexts/gameDataContext"
import PlayerStats from "../../models/playerStats"
import { analyticsService } from "../analyticsService"

export function useGameLogic() {
  const { playerGame, playerStats, updatePlayerGame, saveGameData } =
    useGameData()

  const [showModal, setShowModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null)
  const [showGiveUpConfirmationDialog, setShowGiveUpConfirmationDialog] =
    useState(false)

  const isGameOver =
    playerGame.correctAnswer ||
    playerGame.gaveUp ||
    playerGame.guesses.length >= playerGame.guessesMax
  const isInteractionsDisabled = isGameOver

  const cancelGiveUp = useCallback(() => {
    setShowGiveUpConfirmationDialog(false)
  }, [])

  const confirmGiveUp = useCallback(() => {
    setShowGiveUpConfirmationDialog(false)
    if (playerGame && !playerGame.correctAnswer) {
      analyticsService.trackGameGiveUp(
        playerGame.guesses.length,
        Object.keys(playerGame.hintsUsed || {}).length
      )
      const updatedPlayerGameGiveUp = {
        ...playerGame,
        gaveUp: true,
      }
      updatePlayerGame(updatedPlayerGameGiveUp)
    }
  }, [playerGame, updatePlayerGame])

  const handleGiveUp = useCallback(() => {
    setShowGiveUpConfirmationDialog(true)
  }, [])

  const handleConfettiStop = useCallback(() => {
    setShowConfetti(false)
  }, [])

  const provideGuessFeedback = useCallback((message: string | null) => {
    setGuessFeedback(message)
    if (message) {
      setTimeout(() => setGuessFeedback(null), 2000)
    }
  }, [])

  useEffect(() => {
    const processGameState = async () => {
      if (playerGame.id === "") return

      const isGameOverNow =
        playerGame.correctAnswer ||
        playerGame.gaveUp ||
        playerGame.guesses.length >= playerGame.guessesMax

      if (isGameOverNow) {
        const updatedStats: PlayerStats = { ...playerStats }

        if (!playerGame.statsProcessed) {
          updatedStats.games = (updatedStats.games || 0) + 1

          if (playerGame.correctAnswer) {
            updatedStats.currentStreak = (updatedStats.currentStreak || 0) + 1
            updatedStats.maxStreak = Math.max(
              updatedStats.currentStreak,
              updatedStats.maxStreak || 0
            )

            const winsArray = [...(updatedStats.wins || [0, 0, 0, 0, 0])]
            const guessCount = playerGame.guesses.length
            if (guessCount > 0 && guessCount <= winsArray.length) {
              winsArray[guessCount - 1] = (winsArray[guessCount - 1] || 0) + 1
            }
            updatedStats.wins = winsArray

            analyticsService.trackGameWin(
              playerGame.guesses.length,
              Object.keys(playerGame.hintsUsed || {}).length
            )
          } else {
            updatedStats.currentStreak = 0
            if (!playerGame.gaveUp) {
              analyticsService.trackGameLose(
                Object.keys(playerGame.hintsUsed || {}).length
              )
            }
          }
          const finalPlayerGame = { ...playerGame, statsProcessed: true }
          updatePlayerGame(finalPlayerGame)

          await saveGameData()
        }

        setShowModal(true)
      } else {
        await saveGameData()
      }
    }

    processGameState()
  }, [playerGame])

  return {
    showModal,
    setShowModal,
    showConfetti,
    setShowConfetti,
    guessFeedback,
    showGiveUpConfirmationDialog,
    isInteractionsDisabled,
    handleGiveUp,
    cancelGiveUp,
    confirmGiveUp,
    handleConfettiStop,
    provideGuessFeedback,
  }
}
