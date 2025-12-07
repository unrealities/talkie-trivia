import { StateCreator } from "zustand"
import { produce } from "immer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { GameStoreState, GameSlice } from "../storeTypes"
import {
  defaultPlayerGame,
  defaultPlayerStats,
  generateDateId,
} from "../../models/default"
import { GameHistoryEntry } from "../../models/gameHistory"
import { gameService } from "../../services/gameService"
import { getGameDataService } from "../../services/gameServiceFactory"
import { ASYNC_STORAGE_KEYS } from "../../config/constants"
import { analyticsService } from "../../utils/analyticsService"
import { calculateScore } from "../../utils/scoreUtils"
import { generateImplicitHint } from "../../utils/guessFeedbackUtils"
import {
  DEFAULT_DIFFICULTY,
  DIFFICULTY_MODES,
  DifficultyLevel,
} from "../../config/difficulty"
import { Guess } from "../../models/game"

export const createGameSlice: StateCreator<
  GameStoreState,
  [],
  [],
  GameSlice
> = (set, get) => ({
  playerGame: defaultPlayerGame,
  playerStats: defaultPlayerStats,
  gameStatus: "playing",
  isInteractionsDisabled: true,
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

      // Fetch all necessary data in parallel
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

      // Set Data
      set({ fullItems, basicItems })

      // Handle Difficulty
      let difficulty =
        (storedDifficultyResult as DifficultyLevel) || DEFAULT_DIFFICULTY
      if (!DIFFICULTY_MODES[difficulty]) difficulty = DEFAULT_DIFFICULTY

      // Handle Tutorial State
      set(
        produce((state: GameStoreState) => {
          if (hasSeenGuessInputTip === null) {
            state.tutorialState.showGuessInputTip = true
            analyticsService.trackOnboardingStarted()
          }
          if (hasSeenResultsTip === null) {
            state.tutorialState.showResultsTip = true
          }
        })
      )

      // Initialize Player Data
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
        loading: false,
        isInteractionsDisabled: isGameOver,
        gameStatus: isGameOver ? "gameOver" : "playing",
      })
    } catch (e: any) {
      console.error("GameSlice: Failed to initialize game:", e)
      set({
        error: `Failed to load game: ${e.message}`,
        loading: false,
        isInteractionsDisabled: true,
      })
    }
  },

  makeGuess: (selectedItem) => {
    const { playerGame, fullItems, difficulty, processGameOver } = get()
    if (playerGame.correctAnswer || playerGame.gaveUp) return

    const correctItem = playerGame.triviaItem
    const isCorrectAnswer = correctItem.id === selectedItem.id
    const fullGuessedItem = fullItems.find(
      (item) => item.id === selectedItem.id
    )
    const hintStrategy = DIFFICULTY_MODES[difficulty].hintStrategy

    let hintResult = {
      feedback: null as string | null,
      revealedHints: {} as any,
      hintInfo: null as any,
    }

    // Implicit Hint Logic
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
      produce((state: GameStoreState) => {
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

    processGameOver().catch((error) => {
      console.error("Failed to process game over after guess:", error)
      set({ flashMessage: "Could not save progress. Check connection." })
    })
  },

  useHint: (hintType) => {
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
      produce((state: GameStoreState) => {
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
    const { playerGame, processGameOver } = get()
    analyticsService.trackGameGiveUp(
      playerGame.guesses.length,
      Object.keys(playerGame.hintsUsed || {}).length
    )

    set(
      produce((state: GameStoreState) => {
        state.playerGame.gaveUp = true
      })
    )

    processGameOver().catch((error) => {
      console.error("Failed to process game over after giving up:", error)
      set({ flashMessage: "Could not save progress. Check connection." })
    })
  },

  processGameOver: async () => {
    const { playerGame, playerStats, gameMode } = get()
    const isGameOver =
      playerGame.correctAnswer ||
      playerGame.gaveUp ||
      playerGame.guesses.length >= playerGame.guessesMax

    if (!isGameOver || playerGame.statsProcessed) return

    set({ isInteractionsDisabled: true })

    // Slight delay for animation timing
    setTimeout(() => {
      set({ gameStatus: "revealing" })
    }, 1200)

    const calculatedScore = calculateScore(playerGame)

    // Update Stats locally (Optimistic update)
    const updatedStats = produce(playerStats, (draft) => {
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
      produce((state: GameStoreState) => {
        state.playerGame.statsProcessed = true
      })
    )

    try {
      await gameService.savePlayerProgress(
        playerGame,
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
})
