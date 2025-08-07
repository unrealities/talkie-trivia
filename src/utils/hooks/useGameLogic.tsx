import { useState, useEffect, useCallback, useMemo, useReducer } from "react"
import { useAnimatedStyle, withTiming } from "react-native-reanimated"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getFirestore } from "firebase/firestore"
import { Movie, BasicMovie } from "../../models/movie"
import popularMoviesData from "../../../data/popularMovies.json"
import basicMoviesData from "../../../data/basicMovies.json"
import { useAuth } from "../../contexts/authContext"
import PlayerStats from "../../models/playerStats"
import {
  defaultPlayerGame,
  defaultPlayerStats,
  generateDateId,
} from "../../models/default"
import {
  fetchOrCreatePlayerGame,
  fetchOrCreatePlayerStats,
} from "../../utils/firestore/playerDataServices"
import { batchUpdatePlayerData } from "../../utils/firebaseService"
import { analyticsService } from "../../utils/analyticsService"
import { GameHistoryEntry } from "../../models/gameHistory"
import { gameReducer } from "../../state/gameReducer"

const ONBOARDING_STORAGE_KEY = "hasSeenOnboarding"

export function useGameLogic() {
  const { player, loading: authLoading } = useAuth()
  const [movies, setMovies] = useState<readonly Movie[]>([])
  const [basicMovies, setBasicMovies] = useState<readonly BasicMovie[]>([])
  const [assetsLoading, setAssetsLoading] = useState(true)
  const [assetsError, setAssetsError] = useState<string | null>(null)
  const [playerGame, dispatch] = useReducer(gameReducer, defaultPlayerGame)

  const [playerStats, setPlayerStats] =
    useState<PlayerStats>(defaultPlayerStats)
  const [gameDataLoading, setGameDataLoading] = useState(true)
  const [gameDataError, setGameDataError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const loading = assetsLoading || authLoading || gameDataLoading
  const error = assetsError || gameDataError

  const animatedModalStyles = useAnimatedStyle(() => ({
    opacity: withTiming(showModal ? 1 : 0, { duration: 300 }),
  }))

  const isInteractionsDisabled =
    loading ||
    playerGame.correctAnswer ||
    playerGame.gaveUp ||
    playerGame.guesses.length >= playerGame.guessesMax

  useEffect(() => {
    try {
      if (__DEV__) console.log("useGameLogic: Loading static movie data...")
      if (!popularMoviesData || popularMoviesData.length === 0)
        throw new Error("Invalid or empty popular movies data.")
      if (!basicMoviesData || basicMoviesData.length === 0)
        throw new Error("Invalid or empty basic movies data.")

      setMovies(popularMoviesData as Movie[])
      setBasicMovies(basicMoviesData as BasicMovie[])
      if (__DEV__)
        console.log("useGameLogic: Static movie data loaded successfully.")
    } catch (e: any) {
      console.error("useGameLogic: Error loading movie data:", e)
      setAssetsError(e.message)
    } finally {
      setAssetsLoading(false)
    }
  }, [])

  const movieForToday = useMemo(() => {
    if (movies.length === 0) return null
    const today = new Date()
    const start = new Date(today.getFullYear(), 0, 0)
    const diff = (today as any) - (start as any)
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)

    const todayMovieIndex = dayOfYear % movies.length
    const movie = movies[todayMovieIndex]

    if (!movie || !movie.id || !movie.overview) {
      console.error("useGameLogic: Invalid movie for today selected.")
      setAssetsError("Could not determine a valid movie for today.")
      return null
    }
    return movie
  }, [movies])

  const saveGameData = useCallback(
    async (historyEntry: GameHistoryEntry | null = null) => {
      if (!player) {
        console.error(
          "useGameLogic: Cannot save data, player is not available."
        )
        return
      }
      try {
        await batchUpdatePlayerData(
          playerStats,
          playerGame,
          player.id,
          historyEntry
        )
        if (__DEV__) console.log("useGameLogic: Game data saved successfully.")
      } catch (e: any) {
        console.error("useGameLogic: Failed to save game data", e)
        setGameDataError(`Failed to save progress: ${e.message}`)
      }
    },
    [player, playerGame, playerStats]
  )

  useEffect(() => {
    const initializeData = async () => {
      if (authLoading || assetsLoading || !player || !movieForToday) {
        return
      }

      setGameDataLoading(true)
      setGameDataError(null)

      try {
        if (__DEV__)
          console.log("useGameLogic: Initializing player game data...")
        const db = getFirestore()
        const today = new Date()
        const dateId = generateDateId(today)

        const [game, stats] = await Promise.all([
          fetchOrCreatePlayerGame(db, player.id, dateId, today, movieForToday),
          fetchOrCreatePlayerStats(db, player.id),
        ])

        dispatch({ type: "INITIALIZE_GAME", payload: game })

        setPlayerStats(stats)
        if (
          !game.correctAnswer &&
          !game.gaveUp &&
          game.guesses.length < game.guessesMax
        ) {
          analyticsService.trackGameStart(game.movie.id, game.movie.title)
        }
        if (__DEV__)
          console.log(
            "useGameLogic: Player game data initialized successfully."
          )
      } catch (e: any) {
        console.error("useGameLogic: Error initializing data:", e)
        setGameDataError(`Failed to load game data: ${e.message}`)
      } finally {
        setGameDataLoading(false)
      }
    }
    initializeData()
  }, [player, movieForToday, authLoading, assetsLoading])

  const updatePlayerStats = useCallback((newPlayerStats: PlayerStats) => {
    setPlayerStats(newPlayerStats)
  }, [])

  const handleConfettiStop = useCallback(() => {
    setShowConfetti(false)
  }, [])

  useEffect(() => {
    const processGameState = async () => {
      if (playerGame.id === "") return

      const isGameOverNow =
        playerGame.correctAnswer ||
        playerGame.gaveUp ||
        playerGame.guesses.length >= playerGame.guessesMax

      if (isGameOverNow) {
        let historyEntry: GameHistoryEntry | null = null

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

          dispatch({ type: "SET_STATS_PROCESSED" })

          setPlayerStats(updatedStats)

          await saveGameData(historyEntry)
        }
        setShowModal(true)
      } else {
        await saveGameData(null)
      }
    }

    processGameState()
  }, [
    playerGame.correctAnswer,
    playerGame.gaveUp,
    playerGame.guesses.length,
    playerGame.statsProcessed,
    playerStats,
    saveGameData,
  ])

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
    loading,
    error,
    movies,
    basicMovies,
    showModal,
    showConfetti,
    isInteractionsDisabled,
    animatedModalStyles,
    showOnboarding,
    handleConfettiStop,
    setShowModal,
    setShowConfetti,
    handleDismissOnboarding,
    updatePlayerStats,
    player,
    dispatch,
  }
}
