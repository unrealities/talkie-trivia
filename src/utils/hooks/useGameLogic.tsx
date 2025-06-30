import { useState, useCallback, useEffect } from "react"
import { useGameData } from "../../contexts/gameDataContext"
import PlayerStats from "../../models/playerStats"

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
    playerGame.guesses.length >= playerGame.game.guessesMax
  const isInteractionsDisabled = isGameOver

  const cancelGiveUp = useCallback(() => {
    setShowGiveUpConfirmationDialog(false)
  }, [])

  const confirmGiveUp = useCallback(() => {
    setShowGiveUpConfirmationDialog(false)
    if (playerGame && !playerGame.correctAnswer) {
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

  // Effect to handle game state changes and save data
  useEffect(() => {
    const processGameState = async () => {
      // Don't do anything for the default/uninitialized game state
      if (playerGame.id === "") return

      const isGameOverNow =
        playerGame.correctAnswer ||
        playerGame.gaveUp ||
        playerGame.guesses.length >= playerGame.game.guessesMax

      if (isGameOverNow) {
        // Create a fresh stats object for update to avoid mutation issues
        const updatedStats: PlayerStats = { ...playerStats }

        // This check prevents updating stats multiple times for the same game
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
          } else {
            // Loss or gave up
            updatedStats.currentStreak = 0
          }

          // Mark game as processed and update state before saving
          const finalPlayerGame = { ...playerGame, statsProcessed: true }
          updatePlayerGame(finalPlayerGame)

          // Now save the final state
          await saveGameData()
        }

        setShowModal(true)
      } else {
        // If it's just a regular guess (not game over), save progress
        await saveGameData()
      }
    }

    processGameState()
  }, [playerGame.correctAnswer, playerGame.gaveUp, playerGame.guesses.length])

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
