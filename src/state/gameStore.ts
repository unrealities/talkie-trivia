import { create } from "zustand"
import { produce } from "immer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { PlayerGame, Difficulty, HintType } from "../models/game"
import PlayerStats from "../models/playerStats"
import { Movie, BasicMovie } from "../models/movie"
import {
  defaultPlayerGame,
  defaultPlayerStats,
  generateDateId,
} from "../models/default"
import { GameHistoryEntry } from "../models/gameHistory"
import { gameService } from "../services/gameService"
import Player from "../models/player"
import { ASYNC_STORAGE_KEYS } from "../config/constants"
import { analyticsService } from "../utils/analyticsService"
import { generateImplicitHint } from "../utils/guessFeedbackUtils"
import basicMoviesData from "../../data/basicMovies.json"

export interface GameState {
  // Core State
  playerGame: PlayerGame
  playerStats: PlayerStats
  basicMovies: readonly BasicMovie[]
  movies: readonly Movie[]

  // App Status
  loading: boolean
  error: string | null
  isInteractionsDisabled: boolean

  // Settings
  difficulty: Difficulty
  tutorialState: {
    showGuessInputTip: boolean
    showResultsTip: boolean
  }

  // UI State
  showModal: boolean
  showConfetti: boolean
  flashMessage: string | null
  lastGuessResult: {
    movieId: number
    correct: boolean
    feedback?: string | null
    hintInfo?: any | null
  } | null

  // Actions
  initializeGame: (player: Player) => Promise<void>
  setDifficulty: (newDifficulty: Difficulty, player: Player) => void
  dismissGuessInputTip: () => void
  dismissResultsTip: () => void
  makeGuess: (selectedMovie: BasicMovie) => void
  useHint: (hintType: HintType) => void
  giveUp: () => void
  setShowModal: (show: boolean) => void
  handleConfettiStop: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  // --- INITIAL STATE ---
  playerGame: defaultPlayerGame,
  playerStats: defaultPlayerStats,
  basicMovies: basicMoviesData as readonly BasicMovie[],
  movies: [],
  loading: true,
  error: null,
  isInteractionsDisabled: true,
  difficulty: "medium",
  tutorialState: {
    showGuessInputTip: false,
    showResultsTip: false,
  },
  showModal: false,
  showConfetti: false,
  flashMessage: null,
  lastGuessResult: null,

  initializeGame: async (player) => {
    set({ loading: true, error: null, isInteractionsDisabled: true })
    try {
      const storedDifficulty =
        ((await AsyncStorage.getItem(
          ASYNC_STORAGE_KEYS.DIFFICULTY_SETTING
        )) as Difficulty) || "medium"

      const hasSeenGuessInputTip = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.TUTORIAL_GUESS_INPUT_SEEN
      )
      const hasSeenResultsTip = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.TUTORIAL_RESULTS_SEEN
      )

      if (hasSeenGuessInputTip === null) {
        set(
          produce((state: GameState) => {
            state.tutorialState.showGuessInputTip = true
          })
        )
        analyticsService.trackOnboardingStarted()
      }
      if (hasSeenResultsTip === null) {
        set(
          produce((state: GameState) => {
            state.tutorialState.showResultsTip = true
          })
        )
      }

      const { initialPlayerGame, initialPlayerStats, allMovies } =
        await gameService.getInitialGameData(player, storedDifficulty)

      const isGameOver =
        initialPlayerGame.correctAnswer ||
        initialPlayerGame.gaveUp ||
        initialPlayerGame.guesses.length >= initialPlayerGame.guessesMax

      set({
        difficulty: storedDifficulty,
        playerGame: initialPlayerGame,
        playerStats: initialPlayerStats,
        movies: allMovies,
        loading: false,
        isInteractionsDisabled: isGameOver,
      })
    } catch (e: any) {
      console.error("Zustand Store: Failed to initialize game:", e)
      set({
        error: `Failed to load game: ${e.message}`,
        loading: false,
        isInteractionsDisabled: true,
      })
    }
  },

  setDifficulty: (newDifficulty, player) => {
    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.DIFFICULTY_SETTING, newDifficulty)
    set({ difficulty: newDifficulty })
    get().initializeGame(player)
  },

  dismissGuessInputTip: () => {
    set(
      produce((state: GameState) => {
        state.tutorialState.showGuessInputTip = false
      })
    )
    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.TUTORIAL_GUESS_INPUT_SEEN, "true")
  },

  dismissResultsTip: () => {
    set(
      produce((state: GameState) => {
        state.tutorialState.showResultsTip = false
      })
    )
    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.TUTORIAL_RESULTS_SEEN, "true")
    analyticsService.trackOnboardingCompleted()
  },

  makeGuess: (selectedMovie) => {
    const { playerGame, movies } = get()
    if (playerGame.correctAnswer || playerGame.gaveUp) return

    const correctMovie = playerGame.movie
    const isCorrectAnswer = correctMovie.id === selectedMovie.id
    let feedback = null
    let hintInfo = null

    analyticsService.trackGuessMade(
      playerGame.guesses.length + 1,
      isCorrectAnswer,
      selectedMovie.id,
      selectedMovie.title
    )

    if (!isCorrectAnswer) {
      const fullGuessedMovie = movies.find((m) => m.id === selectedMovie.id)
      if (fullGuessedMovie) {
        const result = generateImplicitHint(
          fullGuessedMovie,
          correctMovie,
          playerGame.hintsUsed
        )
        feedback = result.feedback
        if (result.hintType && result.hintValue) {
          hintInfo = { type: result.hintType, value: result.hintValue }
        }
      }
    }

    set(
      produce((state: GameState) => {
        state.playerGame.guesses.push(selectedMovie.id)
        state.playerGame.correctAnswer = isCorrectAnswer
        if (hintInfo) {
          state.playerGame.hintsUsed = {
            ...state.playerGame.hintsUsed,
            [hintInfo.type]: true,
          }
        }
        state.lastGuessResult = {
          movieId: selectedMovie.id,
          correct: isCorrectAnswer,
          feedback,
          hintInfo,
        }
      })
    )

    if (isCorrectAnswer) set({ showConfetti: true })

    get()._processGameOver()
  },

  useHint: (hintType) => {
    const { playerGame, playerStats } = get()
    if (playerGame.hintsUsed?.[hintType] || playerStats.hintsAvailable <= 0)
      return

    analyticsService.trackHintUsed(
      hintType,
      playerGame.guesses.length,
      playerStats.hintsAvailable - 1
    )

    set(
      produce((state: GameState) => {
        state.playerGame.hintsUsed = {
          ...state.playerGame.hintsUsed,
          [hintType]: true,
        }
        state.playerStats.hintsAvailable = Math.max(
          0,
          state.playerStats.hintsAvailable - 1
        )
        state.playerStats.hintsUsedCount =
          (state.playerStats.hintsUsedCount || 0) + 1
      })
    )
  },

  giveUp: () => {
    const { playerGame } = get()
    analyticsService.trackGameGiveUp(
      playerGame.guesses.length,
      Object.keys(playerGame.hintsUsed || {}).length
    )
    set(
      produce((state: GameState) => {
        state.playerGame.gaveUp = true
      })
    )
    get()._processGameOver()
  },

  _processGameOver: async () => {
    const { playerGame, playerStats } = get()
    const isGameOver =
      playerGame.correctAnswer ||
      playerGame.gaveUp ||
      playerGame.guesses.length >= playerGame.guessesMax

    if (!isGameOver || playerGame.statsProcessed) return
    set({ isInteractionsDisabled: true })

    const updatedStats = produce(playerStats, (draft) => {
      draft.games = (draft.games || 0) + 1
      if (playerGame.correctAnswer) {
        draft.currentStreak = (draft.currentStreak || 0) + 1
        draft.maxStreak = Math.max(draft.currentStreak, draft.maxStreak || 0)
        const guessCount = playerGame.guesses.length
        if (guessCount > 0 && guessCount <= draft.wins.length) {
          draft.wins[guessCount - 1] = (draft.wins[guessCount - 1] || 0) + 1
        }
      } else {
        draft.currentStreak = 0
      }
    })

    const historyEntry = new GameHistoryEntry(
      generateDateId(playerGame.startDate),
      playerGame.movie.id,
      playerGame.movie.title,
      playerGame.movie.poster_path,
      playerGame.correctAnswer,
      playerGame.gaveUp,
      playerGame.guesses.length,
      playerGame.guessesMax
    )

    set(
      produce((state: GameState) => {
        state.playerGame.statsProcessed = true
      })
    )

    try {
      await gameService.savePlayerProgress(
        get().playerGame,
        updatedStats,
        historyEntry
      )
      set({ playerStats: updatedStats, showModal: true })
    } catch (e: any) {
      set({ error: `Failed to save progress: ${e.message}` })
    }
  },

  setShowModal: (show) => set({ showModal: show }),
  handleConfettiStop: () => set({ showConfetti: false }),
}))
