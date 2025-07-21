import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  StyleProp,
  ViewStyle,
} from "react"
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getFirestore } from "firebase/firestore"

import { useAuth } from "./authContext"
import { useAssets } from "./assetsContext"
import { PlayerGame } from "../models/game"
import PlayerStats from "../models/playerStats"
import Player from "../models/player"
import { BasicMovie } from "../models/movie"
import {
  defaultPlayerGame,
  defaultPlayerStats,
  generateDateId,
} from "../models/default"
import {
  fetchOrCreatePlayerGame,
  fetchOrCreatePlayerStats,
} from "../utils/firestore/playerDataServices"
import { batchUpdatePlayerData } from "../utils/firebaseService"
import { analyticsService } from "../utils/analyticsService"
import { GameHistoryEntry } from "../models/gameHistory" // ADDED

const ONBOARDING_STORAGE_KEY = "hasSeenOnboarding"

interface GameContextState {
  // Data state
  playerGame: PlayerGame
  playerStats: PlayerStats
  loading: boolean
  error: string | null

  // UI state
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

  // Convenience accessors
  movies: readonly BasicMovie[]
  player: Player | null
}

const GameContext = createContext<GameContextState | undefined>(undefined)

const useGameController = (): GameContextState => {
  const { player, loading: authLoading } = useAuth()
  const { movieForToday, basicMovies, loading: assetsLoading } = useAssets()

  const [playerGame, setPlayerGame] = useState<PlayerGame>(defaultPlayerGame)
  const [playerStats, setPlayerStats] =
    useState<PlayerStats>(defaultPlayerStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null)
  const [showGiveUpConfirmationDialog, setShowGiveUpConfirmationDialog] =
    useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const animatedModalStyles = useAnimatedStyle(() => ({
    opacity: withTiming(showModal ? 1 : 0, { duration: 300 }),
  }))

  const isInteractionsDisabled =
    loading ||
    authLoading ||
    assetsLoading ||
    playerGame.correctAnswer ||
    playerGame.gaveUp ||
    playerGame.guesses.length >= playerGame.guessesMax

  const saveGameData = useCallback(
    async (historyEntry: GameHistoryEntry | null = null) => {
      if (!player) {
        console.error("GameContext: Cannot save data, player is not available.")
        return
      }
      try {
        await batchUpdatePlayerData(
          playerStats,
          playerGame,
          player.id,
          historyEntry
        ) // MODIFIED
        if (__DEV__) {
          console.log("GameContext: Game data saved successfully.")
        }
      } catch (e: any) {
        console.error("GameContext: Failed to save game data", e)
        setError(`Failed to save progress: ${e.message}`)
      }
    },
    [player, playerGame, playerStats]
  )

  useEffect(() => {
    const initializeData = async () => {
      if (authLoading || assetsLoading || !player || !movieForToday) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        if (__DEV__)
          console.log("GameContext: Initializing player game data...")
        const db = getFirestore()
        const today = new Date()
        const dateId = generateDateId(today)

        const [game, stats] = await Promise.all([
          fetchOrCreatePlayerGame(db, player.id, dateId, today, movieForToday),
          fetchOrCreatePlayerStats(db, player.id),
        ])

        if (
          !game.correctAnswer &&
          !game.gaveUp &&
          game.guesses.length < game.guessesMax
        ) {
          analyticsService.trackGameStart(game.movie.id, game.movie.title)
        }

        setPlayerGame(game)
        setPlayerStats(stats)
        if (__DEV__)
          console.log("GameContext: Player game data initialized successfully.")
      } catch (e: any) {
        console.error("GameContext: Error initializing data:", e)
        setError(`Failed to load game data: ${e.message}`)
      } finally {
        setLoading(false)
      }
    }
    initializeData()
  }, [player, movieForToday, authLoading, assetsLoading])

  const updatePlayerGame = useCallback((newPlayerGame: PlayerGame) => {
    setPlayerGame(newPlayerGame)
  }, [])

  const updatePlayerStats = useCallback((newPlayerStats: PlayerStats) => {
    setPlayerStats(newPlayerStats)
  }, [])

  // --- Game Logic ---
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
      const updatedPlayerGameGiveUp = { ...playerGame, gaveUp: true }
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
        let historyEntry: GameHistoryEntry | null = null // ADDED

        if (!playerGame.statsProcessed) {
          const updatedStats: PlayerStats = { ...playerStats }
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

          const finalPlayerGame = { ...playerGame, statsProcessed: true }
          setPlayerGame(finalPlayerGame)
          setPlayerStats(updatedStats)

          await saveGameData(historyEntry)
        }
        setShowModal(true)
      } else {
        await saveGameData(null)
      }
    }

    processGameState()
  }, [playerGame.correctAnswer, playerGame.gaveUp, playerGame.guesses.length])

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
      setShowOnboarding(false)
    }
  }, [])

  return {
    playerGame,
    playerStats,
    loading: loading || authLoading || assetsLoading,
    error,
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
    movies: basicMovies,
    player,
  }
}

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const gameControllerState = useGameController()

  return (
    <GameContext.Provider value={gameControllerState}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
