import React, { createContext, useContext, ReactNode, useMemo } from "react"
import { useGameData } from "../utils/hooks/useGameData"
import { useGameManager } from "../utils/hooks/useGameManager"
import { useAuth } from "./authContext"
import { useGameSettingsContext } from "./gameSettingsContext"
import { PlayerGame } from "../models/game"
import PlayerStats from "../models/playerStats"
import { Movie, BasicMovie } from "../models/movie"
import { GameAction } from "../state/gameReducer"

interface GameState {
  playerGame: PlayerGame
  playerStats: PlayerStats
  loading: boolean
  error: string | null
  movies: readonly Movie[]
  basicMovies: readonly BasicMovie[]
  isInteractionsDisabled: boolean
  showModal: boolean
  setShowModal: (show: boolean) => void
  showConfetti: boolean
  setShowConfetti: (show: boolean) => void
  handleConfettiStop: () => void
  dispatch: React.Dispatch<GameAction>
  updatePlayerStats: (stats: PlayerStats) => void
  flashMessage: string | null
}

const GameStateContext = createContext<GameState | undefined>(undefined)

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { player, loading: authLoading } = useAuth()
  const { difficulty } = useGameSettingsContext()

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
    flashMessage,
  } = useGameManager(initialPlayerGame, initialPlayerStats, player)

  const loading = authLoading || dataLoading
  const error = dataError || persistenceError

  const isInteractionsDisabled = useMemo(
    () =>
      loading ||
      playerGame.correctAnswer ||
      playerGame.gaveUp ||
      playerGame.guesses.length >= playerGame.guessesMax,
    [loading, playerGame]
  )

  const value = {
    playerGame,
    playerStats,
    loading,
    error,
    movies,
    basicMovies,
    isInteractionsDisabled,
    showModal,
    setShowModal,
    showConfetti,
    setShowConfetti,
    handleConfettiStop,
    dispatch,
    updatePlayerStats,
    flashMessage,
  }

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  )
}

export const useGameState = () => {
  const context = useContext(GameStateContext)
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider")
  }
  return context
}
