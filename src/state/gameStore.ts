import { create } from "zustand"
import { produce } from "immer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { PlayerGame, Guess, HintInfo } from "../models/game"
import PlayerStats from "../models/playerStats"
import { BasicTriviaItem, GameMode, TriviaItem } from "../models/trivia"
import {
  defaultPlayerGame,
  defaultPlayerStats,
  generateDateId,
} from "../models/default"
import { GameHistoryEntry } from "../models/gameHistory"
import { gameService } from "../services/gameService"
import { getGameDataService } from "../services/gameServiceFactory"
import Player from "../models/player"
import { ASYNC_STORAGE_KEYS } from "../config/constants"
import { analyticsService } from "../utils/analyticsService"
import { calculateScore } from "../utils/scoreUtils"
import { generateImplicitHint } from "../utils/guessFeedbackUtils"
import {
  DifficultyLevel,
  DIFFICULTY_MODES,
  DEFAULT_DIFFICULTY,
  DIFFICULTY_RANKING,
} from "../config/difficulty"

export type GameStatus = "playing" | "revealing" | "gameOver"

export interface GameState {
  // Core State
  playerGame: PlayerGame
  playerStats: PlayerStats
  basicItems: readonly BasicTriviaItem[]
  fullItems: readonly TriviaItem[]

  // App Status
  loading: boolean
  error: string | null
  isInteractionsDisabled: boolean
  gameStatus: GameStatus

  // Settings & Mode
  gameMode: GameMode
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
    itemId: number | string
    correct: boolean
    feedback?: string | null
    hintInfo?: HintInfo[] | null
  } | null

  // Actions
  initializeGame: (player: Player) => Promise<void>
  setGameMode: (mode: GameMode) => Promise<void>
  setDifficulty: (newDifficulty: DifficultyLevel) => void
  dismissGuessInputTip: () => void
  dismissResultsTip: () => void
  makeGuess: (selectedItem: BasicTriviaItem) => void
  useHint: (hintType: string) => void
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
  basicItems: [],
  fullItems: [],
  loading: true,
  error: null,
  isInteractionsDisabled: true,
  gameStatus: "playing",
  gameMode: "movies",
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
      const { gameMode } = get()
      const dataService = getGameDataService(gameMode)

      const [
        { dailyItem, fullItems, basicItems },
        storedDifficultyResult,
        hasSeenGuessInputTip,
        hasSeenResultsTip,
      ] = await Promise.all([
        dataService.getDailyTriviaItemAndLists(),
        AsyncStorage.getItem(ASYNC_STORAGE_KEYS.DIFFICULTY_SETTING),
        AsyncStorage.getItem(ASYNC_STORAGE_KEYS.TUTORIAL_GUESS_INPUT_SEEN),
        AsyncStorage.getItem(ASYNC_STORAGE_KEYS.TUTORIAL_RESULTS_SEEN),
      ])

      let difficulty =
        (storedDifficultyResult as DifficultyLevel) || DEFAULT_DIFFICULTY
      if (!DIFFICULTY_MODES[difficulty]) {
        difficulty = DEFAULT_DIFFICULTY
      }

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

      const dateId = generateDateId(new Date())
      const guessesMax = DIFFICULTY_MODES[difficulty].guessesMax

      const [initialPlayerGame, initialPlayerStats] = await Promise.all([
        gameService.fetchOrCreatePlayerGame(
          player.id,
          dateId,
          dailyItem,
          guessesMax
        ),
        gameService.fetchOrCreatePlayerStats(player.id),
      ])

      initialPlayerGame.difficulty = difficulty
      const isGameOver =
        initialPlayerGame.correctAnswer ||
        initialPlayerGame.gaveUp ||
        initialPlayerGame.guesses.length >= initialPlayerGame.guessesMax

      set({
        difficulty,
        playerGame: initialPlayerGame,
        playerStats: initialPlayerStats,
        fullItems,
        basicItems,
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

  setGameMode: async (mode: GameMode) => {
    const { gameMode, playerGame } = get()
    if (mode === gameMode) return

    if (
      playerGame.guesses.length > 0 &&
      !playerGame.correctAnswer &&
      !playerGame.gaveUp
    ) {
      set({ flashMessage: "Finish the current game before switching modes!" })
      setTimeout(() => set({ flashMessage: null }), 3000)
      return
    }

    set({ gameMode: mode })
    const player = { id: get().playerGame.playerID, name: get().playerStats.id }
    await get().initializeGame(player)
  },

  setDifficulty: (newDifficulty: DifficultyLevel) => {
    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.DIFFICULTY_SETTING, newDifficulty)

    set(
      produce((state: GameState) => {
        state.difficulty = newDifficulty
        state.playerGame.guessesMax = DIFFICULTY_MODES[newDifficulty].guessesMax

        const currentLowestRank =
          DIFFICULTY_RANKING[state.playerGame.difficulty]
        const newRank = DIFFICULTY_RANKING[newDifficulty]

        if (newRank < currentLowestRank) {
          state.playerGame.difficulty = newDifficulty
          state.flashMessage = `Score will be based on ${DIFFICULTY_MODES[newDifficulty].label} mode.`
        }
      })
    )
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

  makeGuess: (selectedItem) => {
    const { playerGame, fullItems, difficulty } = get()
    if (playerGame.correctAnswer || playerGame.gaveUp) return

    const correctItem = playerGame.triviaItem
    const isCorrectAnswer = correctItem.id === selectedItem.id

    const fullGuessedItem = fullItems.find(
      (item) => item.id === selectedItem.id
    )

    const hintStrategy = DIFFICULTY_MODES[difficulty].hintStrategy

    let hintResult: {
      feedback: string | null
      revealedHints: Partial<Record<string, boolean>>
      hintInfo: any[] | null
    } = { feedback: null, revealedHints: {}, hintInfo: null }

    if (
      !isCorrectAnswer &&
      fullGuessedItem &&
      hintStrategy === "IMPLICIT_FEEDBACK"
    ) {
      hintResult = generateImplicitHint(
        fullGuessedItem,
        correctItem,
        playerGame.hintsUsed
      )
    } else if (!isCorrectAnswer) {
      hintResult.feedback = "Not quite! Try again."
    }

    analyticsService.trackGuessMade(
      playerGame.guesses.length + 1,
      isCorrectAnswer,
      Number(selectedItem.id),
      selectedItem.title
    )

    const canMakeGuess = playerGame.guesses.length < playerGame.guessesMax

    set(
      produce((state: GameState) => {
        if (canMakeGuess) {
          const newGuess: Guess = {
            itemId: selectedItem.id,
            hintInfo: hintResult.hintInfo,
          }
          state.playerGame.guesses.push(newGuess)
          state.playerGame.correctAnswer = isCorrectAnswer

          if (Object.keys(hintResult.revealedHints).length > 0) {
            state.playerGame.hintsUsed = {
              ...state.playerGame.hintsUsed,
              ...hintResult.revealedHints,
            }
          }
          state.lastGuessResult = {
            itemId: selectedItem.id,
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

  useHint: (hintType: string) => {
    const { playerGame, playerStats, difficulty } = get()
    const isUserSpendStrategy =
      DIFFICULTY_MODES[difficulty].hintStrategy === "USER_SPEND"

    if (
      !isUserSpendStrategy ||
      playerGame.hintsUsed?.[hintType] ||
      (playerStats?.hintsAvailable ?? 0) <= 0
    ) {
      return
    }

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
        if (state.playerStats) {
          state.playerStats.hintsAvailable = Math.max(
            0,
            state.playerStats.hintsAvailable - 1
          )
          state.playerStats.hintsUsedCount =
            (state.playerStats.hintsUsedCount || 0) + 1
        }
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
    const { playerGame, playerStats, gameMode } = get()
    const isGameOver =
      playerGame.correctAnswer ||
      playerGame.gaveUp ||
      playerGame.guesses.length >= playerGame.guessesMax

    if (!isGameOver || playerGame.statsProcessed) return
    set({ isInteractionsDisabled: true })

    setTimeout(() => {
      set({ gameStatus: "revealing" })
    }, 1200)

    const calculatedScore = calculateScore(playerGame)

    const updatedStats = produce(playerStats, (draft: PlayerStats) => {
      draft.games = (draft.games || 0) + 1
      draft.allTimeScore = (draft.allTimeScore || 0) + calculatedScore
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
      itemId: playerGame.triviaItem.id,
      itemTitle: playerGame.triviaItem.title,
      posterPath: playerGame.triviaItem.posterPath,
      wasCorrect: playerGame.correctAnswer,
      gaveUp: playerGame.gaveUp,
      guessCount: playerGame.guesses.length,
      guessesMax: playerGame.guessesMax,
      difficulty: playerGame.difficulty,
      score: calculatedScore,
      gameMode: gameMode,
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
