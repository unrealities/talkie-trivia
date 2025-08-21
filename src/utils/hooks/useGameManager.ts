import { useState, useEffect, useCallback, useReducer } from "react"
import Player from "../../models/player"
import { PlayerGame } from "../../models/game"
import PlayerStats from "../../models/playerStats"
import { GameHistoryEntry } from "../../models/gameHistory"
import { gameReducer } from "../../state/gameReducer"
import { analyticsService } from "../analyticsService"
import { generateDateId } from "../../models/default"
import { gameService } from "../../services/gameService"

export function useGameManager(
  initialPlayerGame: PlayerGame,
  initialPlayerStats: PlayerStats,
  player: Player | null
) {
  const [playerGame, dispatch] = useReducer(gameReducer, initialPlayerGame)
  const [playerStats, setPlayerStats] =
    useState<PlayerStats>(initialPlayerStats)

  const [showModal, setShowModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [persistenceError, setPersistenceError] = useState<string | null>(null)

  useEffect(() => {
    dispatch({ type: "INITIALIZE_GAME", payload: initialPlayerGame })
  }, [initialPlayerGame])

  useEffect(() => {
    setPlayerStats(initialPlayerStats)
  }, [initialPlayerStats])

  const saveGameData = useCallback(
    async (historyEntry: GameHistoryEntry | null = null) => {
      if (!player) return
      try {
        await gameService.savePlayerProgress(
          playerGame,
          playerStats,
          historyEntry
        )
      } catch (e: any) {
        setPersistenceError(`Failed to save progress: ${e.message}`)
      }
    },
    [player, playerGame, playerStats]
  )

  useEffect(() => {
    const processGameState = async () => {
      if (!playerGame.id) return

      const isGameOver =
        playerGame.correctAnswer ||
        playerGame.gaveUp ||
        playerGame.guesses.length >= playerGame.guessesMax

      if (!isGameOver) {
        if (playerGame.guesses.length > 0) {
          await saveGameData(null)
        }
        return
      }

      if (playerGame.statsProcessed) return

      let historyEntry: GameHistoryEntry | null = null
      const updatedStats = { ...playerStats }
      updatedStats.games = (updatedStats.games || 0) + 1

      if (playerGame.correctAnswer) {
        updatedStats.currentStreak = (updatedStats.currentStreak || 0) + 1
        updatedStats.maxStreak = Math.max(
          updatedStats.currentStreak,
          updatedStats.maxStreak || 0
        )
        const winsArray = [...(updatedStats.wins || [])]
        const guessCount = playerGame.guesses.length
        if (guessCount > 0 && guessCount <= winsArray.length) {
          winsArray[guessCount - 1] = (winsArray[guessCount - 1] || 0) + 1
        }
        updatedStats.wins = winsArray
        analyticsService.trackGameWin(
          guessCount,
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

      historyEntry = new GameHistoryEntry(
        generateDateId(playerGame.startDate),
        playerGame.movie.id,
        playerGame.movie.title,
        playerGame.movie.poster_path,
        playerGame.correctAnswer,
        playerGame.gaveUp,
        playerGame.guesses.length,
        playerGame.guessesMax
      )

      setPlayerStats(updatedStats)
      dispatch({ type: "SET_STATS_PROCESSED" })

      await saveGameData(historyEntry)
      setShowModal(true)
    }

    processGameState()
  }, [playerGame, playerStats, saveGameData])

  const handleConfettiStop = useCallback(() => setShowConfetti(false), [])

  return {
    playerGame,
    dispatch,
    playerStats,
    updatePlayerStats: setPlayerStats,
    showModal,
    setShowModal,
    showConfetti,
    setShowConfetti,
    handleConfettiStop,
    persistenceError,
  }
}
