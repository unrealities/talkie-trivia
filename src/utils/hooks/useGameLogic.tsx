import { useState, useCallback, useEffect } from "react"
import { batchUpdatePlayerData } from "../firebaseService"
import { useAppContext } from "../../contexts/appContext"
import { PlayerGame } from "../../models/game"
import Player from "../../models/player"
import PlayerStats from "../../models/playerStats"

interface UseGameLogicProps {
  initialDataLoaded: boolean
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats
  updatePlayerGame: (game: PlayerGame) => void
}

export function useGameLogic({
  initialDataLoaded,
  player,
  playerGame,
  playerStats,
  updatePlayerGame,
}: UseGameLogicProps) {
  const { dispatch } = useAppContext()
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
        correctAnswer: false,
        guesses: [...playerGame.guesses, -1],
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

  const updatePlayerData = useCallback(async () => {
    if (!player || !player.id) {
      console.warn("useGameLogic: Player data not loaded yet. Aborting update.")
      return
    }
    if (!playerGame || Object.keys(playerGame).length === 0) {
      console.log("useGameLogic: playerGame is empty, skipping update.")
      return
    }

    const isGameOverNow =
      playerGame.correctAnswer ||
      playerGame.gaveUp ||
      playerGame.guesses.length >= playerGame.game.guessesMax

    if (isGameOverNow) {
      const updatedStats = { ...playerStats }

      if (!updatedStats.id) {
        console.warn(
          "useGameLogic: playerStats.id is undefined! Aborting update."
        )
        console.log(
          "DEBUG: playerStats in useGameLogic when ID undefined:",
          playerStats
        )
        return
      }

      if (playerGame.correctAnswer) {
        updatedStats.currentStreak = (updatedStats.currentStreak || 0) + 1
        updatedStats.maxStreak = Math.max(
          updatedStats.currentStreak,
          updatedStats.maxStreak || 0
        )
        updatedStats.wins = updatedStats.wins || [0, 0, 0, 0, 0]
        if (
          playerGame.guesses.length > 0 &&
          playerGame.guesses.length <= updatedStats.wins.length
        ) {
          updatedStats.wins[playerGame.guesses.length - 1] =
            (updatedStats.wins[playerGame.guesses.length - 1] || 0) + 1
        }
      } else {
        updatedStats.currentStreak = 0
      }
      updatedStats.games = (updatedStats.games || 0) + 1

      try {
        const result = await batchUpdatePlayerData(
          updatedStats,
          playerGame,
          player.id,
          { hintsAvailable: updatedStats.hintsAvailable }
        )
        if (result.success) {
          console.log(
            "useGameLogic: Firebase update successful (Game Over), calling setShowModal(true)"
          )
          setShowModal(true)
        } else {
          console.error(
            "useGameLogic: Firebase batch update failed (Game Over)."
          )
        }
      } catch (error) {
        console.error("useGameLogic: Error updating game over data:", error)
        dispatch({
          type: "SET_DATA_LOADING_ERROR",
          payload: (error as Error).message,
        })
      }
    } else if (playerGame.guesses.length > 0) {
      try {
        console.log("useGameLogic: Updating ongoing game data...")
        const result = await batchUpdatePlayerData({}, playerGame, player.id)
        if (!result.success) {
          console.error(
            "useGameLogic: Firebase batch update failed (Ongoing Game)."
          )
        } else {
          console.log("useGameLogic: Ongoing game data updated successfully.")
        }
      } catch (err) {
        console.error(
          "useGameLogic: Error updating ongoing player game data:",
          err
        )
        dispatch({
          type: "SET_DATA_LOADING_ERROR",
          payload: (err as Error).message,
        })
      }
    }
  }, [player, playerGame, playerStats, dispatch])

  useEffect(() => {
    const isGameOverNow =
      playerGame.correctAnswer ||
      playerGame.gaveUp ||
      playerGame.guesses.length >= playerGame.game.guessesMax

    if (initialDataLoaded && isGameOverNow) {
      console.log(
        "useGameLogic useEffect[game over]: Game ended, calling updatePlayerData."
      )
      updatePlayerData()
    } else if (
      initialDataLoaded &&
      playerGame.guesses.length > 0 &&
      !isGameOverNow
    ) {
      console.log(
        "useGameLogic useEffect[ongoing guess]: Guess made, calling updatePlayerData."
      )
      updatePlayerData()
    }
  }, [
    initialDataLoaded,
    playerGame.correctAnswer,
    playerGame.gaveUp,
    playerGame.guesses.length,
    updatePlayerData,
  ])

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
