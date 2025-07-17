import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react"
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import AsyncStorage from "@react-native-async-storage/async-storage"

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
import { analyticsService } from "../utils/analyticsService"

const ONBOARDING_STORAGE_KEY = "hasSeenOnboarding"

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
  showOnboarding: boolean

  // Handlers
  handleGiveUp: () => void
  cancelGiveUp: () => void
  confirmGiveUp: () => void
  handleConfettiStop: () => void
  provideGuessFeedback: (message: string | null) => void
  setShowModal: (show: boolean) => void
  setShowConfetti: (show: boolean) => void
  handleDismissOnboarding: () => void

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

  const [showOnboarding, setShowOnboarding] = useState(false)

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

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY)
        if (hasSeen === null) {
          analyticsService.trackOnboardingStarted()
          setShowOnboarding(true)
        }
      } catch (e) {
        console.error("Failed to read onboarding status from storage", e)
      }
    }
    checkOnboardingStatus()
  }, [])

  const handleDismissOnboarding = useCallback(async () => {
    try {
      analyticsService.trackOnboardingCompleted()
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true")
      setShowOnboarding(false)
    } catch (e) {
      console.error("Failed to save onboarding status to storage", e)
      // Still hide the modal for a good user experience
      setShowOnboarding(false)
    }
  }, [])

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
    showOnboarding,
    handleGiveUp,
    cancelGiveUp,
    confirmGiveUp,
    handleConfettiStop,
    provideGuessFeedback,
    setShowModal,
    setShowConfetti,
    handleDismissOnboarding,
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
