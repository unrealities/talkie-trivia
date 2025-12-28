import { act, renderHook } from "@testing-library/react-native"
import { useGameStore } from "../../src/state/gameStore"
import { defaultPlayerGame, defaultPlayerStats } from "../../src/models/default"
import { analyticsService } from "../../src/utils/analyticsService"

// Mocks
jest.mock("../../src/utils/analyticsService")
jest.mock("../../src/services/gameService")
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
)

// Mock Data
const mockBasicItem = {
  id: 101,
  title: "The Matrix",
  releaseDate: "1999",
  posterPath: "/path",
}
const mockFullItem = {
  id: 101,
  title: "The Matrix",
  description: "Neo...",
  posterPath: "/path",
  releaseDate: "1999",
  metadata: {},
  hints: [
    { type: "director", label: "Director", value: "Wachowski" },
    { type: "genre", label: "Genre", value: "Sci-Fi" },
  ],
}

describe("State: gameStore", () => {
  const initialState = useGameStore.getState()

  beforeEach(() => {
    jest.clearAllMocks()
    useGameStore.setState({
      ...initialState,
      playerGame: {
        ...defaultPlayerGame,
        triviaItem: mockFullItem,
        guessesMax: 5,
      },
      playerStats: { ...defaultPlayerStats, hintsAvailable: 3 },
      fullItems: [mockFullItem],
      basicItems: [mockBasicItem],
      isInteractionsDisabled: false,
      difficulty: "LEVEL_3", // Medium: Implicit Feedback
    })
  })

  describe("makeGuess", () => {
    it("should process a correct guess", async () => {
      const { result } = renderHook(() => useGameStore())

      await act(async () => {
        result.current.makeGuess(mockBasicItem)
      })

      const state = result.current
      expect(state.playerGame.correctAnswer).toBe(true)
      expect(state.showConfetti).toBe(true)
      expect(state.isInteractionsDisabled).toBe(true) // Game over triggered
      expect(analyticsService.trackGuessMade).toHaveBeenCalledWith(
        1,
        true,
        101,
        "The Matrix"
      )
    })

    it("should process an incorrect guess and provide feedback", async () => {
      const { result } = renderHook(() => useGameStore())
      const wrongItem = { ...mockBasicItem, id: 999, title: "Wrong Movie" }

      await act(async () => {
        result.current.makeGuess(wrongItem)
      })

      const state = result.current
      expect(state.playerGame.correctAnswer).toBe(false)
      expect(state.playerGame.guesses).toHaveLength(1)
      expect(state.lastGuessResult?.correct).toBe(false)
      expect(analyticsService.trackGuessMade).toHaveBeenCalledWith(
        1,
        false,
        999,
        "Wrong Movie"
      )
    })

    it("should not allow guesses if game is over", () => {
      const { result } = renderHook(() => useGameStore())

      act(() => {
        useGameStore.setState({
          playerGame: { ...defaultPlayerGame, correctAnswer: true },
        })
      })

      act(() => {
        result.current.makeGuess(mockBasicItem)
      })

      // Should not have added a guess
      expect(useGameStore.getState().playerGame.guesses).toHaveLength(0)
    })
  })

  describe("useHint", () => {
    it("should decrement hintsAvailable and mark hint as used", () => {
      const { result } = renderHook(() => useGameStore())

      // Switch to a mode that allows manual hints (Level 2)
      act(() => {
        result.current.setDifficulty("LEVEL_2")
      })

      act(() => {
        result.current.useHint("director")
      })

      const state = result.current
      expect(state.playerGame.hintsUsed?.director).toBe(true)
      expect(state.playerStats.hintsAvailable).toBe(2) // Started with 3
      expect(analyticsService.trackHintUsed).toHaveBeenCalled()
    })

    it("should not allow using a hint if none available", () => {
      const { result } = renderHook(() => useGameStore())

      act(() => {
        result.current.setDifficulty("LEVEL_2")
        useGameStore.setState({
          playerStats: { ...defaultPlayerStats, hintsAvailable: 0 },
        })
      })

      act(() => {
        result.current.useHint("genre")
      })

      const state = result.current
      expect(state.playerGame.hintsUsed?.genre).toBeUndefined()
    })
  })

  describe("giveUp", () => {
    it("should mark game as gaveUp and disable interactions", async () => {
      const { result } = renderHook(() => useGameStore())

      await act(async () => {
        result.current.giveUp()
      })

      const state = result.current
      expect(state.playerGame.gaveUp).toBe(true)
      expect(state.isInteractionsDisabled).toBe(true)
      expect(analyticsService.trackGameGiveUp).toHaveBeenCalled()
    })
  })
})
