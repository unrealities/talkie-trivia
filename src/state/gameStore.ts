import { create } from "zustand"
import { produce } from "immer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { PlayerGame, HintType, Guess, HintInfo } from "../models/game"
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
import basicMoviesData from "../../data/popularMovies.json"
import { useShallow } from "zustand/react/shallow"
import {
  DifficultyLevel,
  DIFFICULTY_MODES,
  DEFAULT_DIFFICULTY,
} from "../config/difficulty"

const uniqueBasicMovies = Array.from(
  new Map(basicMoviesData.map((movie) => [movie.id, movie])).values()
) as readonly BasicMovie[]

export type GameStatus = "playing" | "revealing" | "gameOver"

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
  gameStatus: GameStatus

  // Settings
  difficulty: DifficultyLevel
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
    hintInfo?: HintInfo[] | null
  } | null

  // Actions
  initializeGame: (player: Player) => Promise<void>
  setDifficulty: (newDifficulty: DifficultyLevel, player: Player) => void
  dismissGuessInputTip: () => void
  dismissResultsTip: () => void
  makeGuess: (selectedMovie: BasicMovie) => void
  useHint: (hintType: HintType) => void
  giveUp: () => void
  setShowModal: (show: boolean) => void
  handleConfettiStop: () => void
  _processGameOver: () => Promise<void>
  completeRevealSequence: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  // --- INITIAL STATE ---
  playerGame: defaultPlayerGame,
  playerStats: defaultPlayerStats,
  basicMovies: uniqueBasicMovies,
  movies: [],
  loading: true,
  error: null,
  isInteractionsDisabled: true,
  gameStatus: "playing",
  difficulty: DEFAULT_DIFFICULTY,
  tutorialState: {
    showGuessInputTip: false,
    showResultsTip: false,
  },
  showModal: false,
  showConfetti: false,
  flashMessage: null,
  lastGuessResult: null,

  initializeGame: async (player) => {
    set({
      loading: true,
      error: null,
      isInteractionsDisabled: true,
      gameStatus: "playing",
    })
    try {
      let storedDifficulty =
        ((await AsyncStorage.getItem(
          ASYNC_STORAGE_KEYS.DIFFICULTY_SETTING
        )) as DifficultyLevel) || DEFAULT_DIFFICULTY

      if (!DIFFICULTY_MODES[storedDifficulty]) {
        console.warn(
          `Invalid difficulty setting found in storage: '${storedDifficulty}'. Defaulting to ${DEFAULT_DIFFICULTY}.`
        )
        storedDifficulty = DEFAULT_DIFFICULTY
      }

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
        gameStatus: isGameOver ? "gameOver" : "playing",
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
    analyticsService.trackOnboardingCompleted()
    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.TUTORIAL_RESULTS_SEEN, "true")
  },

  makeGuess: (selectedMovie) => {
    const { playerGame, movies, difficulty } = get()
    if (playerGame.correctAnswer || playerGame.gaveUp) return

    const correctMovie = playerGame.movie
    const isCorrectAnswer = correctMovie.id === selectedMovie.id

    const fullGuessedMovie = movies.find((m) => m.id === selectedMovie.id)

    const hintResult =
      isCorrectAnswer || !fullGuessedMovie
        ? { feedback: null, revealedHints: {}, hintInfo: null }
        : generateImplicitHint(
            fullGuessedMovie,
            correctMovie,
            playerGame.hintsUsed
          )

    analyticsService.trackGuessMade(
      playerGame.guesses.length + 1,
      isCorrectAnswer,
      selectedMovie.id,
      selectedMovie.title
    )

    const hintStrategy = DIFFICULTY_MODES[difficulty].hintStrategy
    const isExtremeChallenge = hintStrategy === "EXTREME_CHALLENGE"
    const canMakeGuess =
      !isExtremeChallenge || playerGame.guesses.length < playerGame.guessesMax

    set(
      produce((state: GameState) => {
        if (canMakeGuess) {
          state.playerGame.guesses.push({
            movieId: selectedMovie.id,
            hintInfo: hintResult.hintInfo,
          })
          state.playerGame.correctAnswer = isCorrectAnswer

          if (Object.keys(hintResult.revealedHints).length > 0) {
            state.playerGame.hintsUsed = {
              ...state.playerGame.hintsUsed,
              ...hintResult.revealedHints,
            }
          }

          state.lastGuessResult = {
            movieId: selectedMovie.id,
            correct: isCorrectAnswer,
            feedback: hintResult.feedback,
            hintInfo: hintResult.hintInfo,
          }
        }
      })
    )

    if (isCorrectAnswer) set({ showConfetti: true })

    get()
      ._processGameOver()
      .catch((error) => {
        console.error("Failed to process game over after guess:", error)
        set({ flashMessage: "Could not save progress. Check connection." })
      })
  },

  useHint: (hintType) => {
    const { playerGame, playerStats, difficulty } = get()
    const isUserSpendStrategy =
      DIFFICULTY_MODES[difficulty].hintStrategy === "USER_SPEND"

    if (!isUserSpendStrategy) return

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
    get()
      ._processGameOver()
      .catch((error) => {
        console.error("Failed to process game over after giving up:", error)
        set({ flashMessage: "Could not save progress. Check connection." })
      })
  },

  _processGameOver: async () => {
    const { playerGame, playerStats } = get()
    const isGameOver =
      playerGame.correctAnswer ||
      playerGame.gaveUp ||
      playerGame.guesses.length >= playerGame.guessesMax

    if (!isGameOver || playerGame.statsProcessed) return
    set({ isInteractionsDisabled: true })

    setTimeout(() => {
      set({ gameStatus: "revealing" })
    }, 1200)

    const updatedStats = produce(playerStats, (draft: PlayerStats) => {
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

    const historyEntry: GameHistoryEntry = {
      dateId: generateDateId(playerGame.startDate),
      movieId: playerGame.movie.id,
      movieTitle: playerGame.movie.title,
      posterPath: playerGame.movie.poster_path,
      wasCorrect: playerGame.correctAnswer,
      gaveUp: playerGame.gaveUp,
      guessCount: playerGame.guesses.length,
      guessesMax: playerGame.guessesMax,
    }

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
      set({ playerStats: updatedStats })
    } catch (e: any) {
      set({ error: `Failed to save progress: ${e.message}` })
      throw e
    }
  },

  completeRevealSequence: () => {
    set({ gameStatus: "gameOver" })
    setTimeout(() => {
      set({ showModal: true })
    }, 500)
  },

  setShowModal: (show) => set({ showModal: show }),
  handleConfettiStop: () => set({ showConfetti: false }),
}))
