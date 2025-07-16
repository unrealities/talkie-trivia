import React, { createContext, useContext, ReactNode } from "react"
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"

import { useGameData } from "./gameDataContext"
import { useGameLogic } from "../utils/hooks/useGameLogic"
import { useAssets } from "./assetsContext"
import { useAuth } from "./authContext"
import { useNetwork } from "./networkContext"

import { BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import Player from "../models/player"
import PlayerStats from "../models/playerStats"
import { StyleProp, ViewStyle } from "react-native"

interface GameplayContextState {
  // Data from other contexts
  isDataLoading: boolean
  isNetworkConnected: boolean
  movies: readonly BasicMovie[]
  player: Player
  playerGame: PlayerGame
  playerStats: PlayerStats

  // UI state and logic from useGameLogic
  showModal: boolean
  showConfetti: boolean
  guessFeedback: string | null
  showGiveUpConfirmationDialog: boolean
  isInteractionsDisabled: boolean
  animatedModalStyles: StyleProp<ViewStyle>

  // Handlers
  handleGiveUp: () => void
  cancelGiveUp: () => void
  confirmGiveUp: () => void
  handleConfettiStop: () => void
  provideGuessFeedback: (message: string | null) => void
  setShowModal: (show: boolean) => void
  setShowConfetti: (show: boolean) => void

  // Update functions
  updatePlayerGame: (game: PlayerGame) => void
  updatePlayerStats: (stats: PlayerStats) => void
}

const GameplayContext = createContext<GameplayContextState | undefined>(
  undefined
)

export const GameplayProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { player, loading: authLoading } = useAuth()
  const { isNetworkConnected } = useNetwork()
  const { basicMovies, loading: assetsLoading } = useAssets()
  const {
    playerGame,
    playerStats,
    loading: gameDataLoading,
    updatePlayerGame,
    updatePlayerStats,
  } = useGameData()

  const {
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
  } = useGameLogic()

  const modalOpacity = useSharedValue(0)
  const animatedModalStyles = useAnimatedStyle(() => ({
    opacity: withTiming(showModal ? 1 : 0, { duration: 300 }),
  }))

  const isDataLoading = authLoading || assetsLoading || gameDataLoading

  const value: GameplayContextState = {
    isDataLoading,
    isNetworkConnected,
    movies: basicMovies,
    player,
    playerGame,
    playerStats,
    showModal,
    showConfetti,
    guessFeedback,
    showGiveUpConfirmationDialog,
    isInteractionsDisabled,
    animatedModalStyles,
    handleGiveUp,
    cancelGiveUp,
    confirmGiveUp,
    handleConfettiStop,
    provideGuessFeedback,
    setShowModal,
    setShowConfetti,
    updatePlayerGame,
    updatePlayerStats,
  }

  return (
    <GameplayContext.Provider value={value}>
      {children}
    </GameplayContext.Provider>
  )
}

export const useGameplay = () => {
  const context = useContext(GameplayContext)
  if (context === undefined) {
    throw new Error("useGameplay must be used within a GameplayProvider")
  }
  return context
}
