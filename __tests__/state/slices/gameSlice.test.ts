import { act, renderHook } from "@testing-library/react-native"
import { useGameStore } from "../../../src/state/gameStore"
import { gameService } from "../../../src/services/gameService"
import { getGameDataService } from "../../../src/services/gameServiceFactory"
import {
  defaultPlayerGame,
  defaultPlayerStats,
} from "../../../src/models/default"
import { generateImplicitHint } from "../../../src/utils/guessFeedbackUtils"

// Mocks
jest.mock("../../../src/services/gameService")
jest.mock("../../../src/services/gameServiceFactory")
jest.mock("../../../src/utils/analyticsService")
jest.mock("../../../src/utils/guessFeedbackUtils")
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
)

describe("State: Game Slice (Edge Cases)", () => {
  const initialState = useGameStore.getState()
  const mockPlayer = { id: "p1", name: "Player" }

  beforeEach(() => {
    useGameStore.setState(initialState, true)
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe("initializeGame", () => {
    it("should handle errors during initialization", async () => {
      ;(getGameDataService as jest.Mock).mockImplementation(() => {
        throw new Error("Service Error")
      })

      const { result } = renderHook(() => useGameStore())
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {})

      await act(async () => {
        await result.current.initializeGame(mockPlayer)
      })

      expect(result.current.error).toContain("Failed to load game")
      expect(result.current.loading).toBe(false)
      consoleSpy.mockRestore()
    })
  })

  describe("processGameOver", () => {
    it("should handle errors when saving progress", async () => {
      const { result } = renderHook(() => useGameStore())

      // Setup state to trigger save
      useGameStore.setState({
        playerGame: {
          ...defaultPlayerGame,
          correctAnswer: true,
          statsProcessed: false,
        },
        playerStats: { ...defaultPlayerStats },
      })

      ;(gameService.savePlayerProgress as jest.Mock).mockRejectedValue(
        new Error("Save Failed")
      )

      await act(async () => {
        try {
          await result.current.processGameOver()
        } catch (e) {
          // We expect this to throw because processGameOver re-throws errors
        }
      })

      expect(result.current.error).toContain("Failed to save progress")
    })
  })

  describe("makeGuess (Edge Cases)", () => {
    it("should handle implicit hint generation", () => {
      const { result } = renderHook(() => useGameStore())
      const correctItem = { id: 100, title: "Correct" } as any
      const wrongItemFull = { id: 200, title: "Wrong" } as any
      const wrongItemBasic = { id: 200, title: "Wrong" } as any

      useGameStore.setState({
        playerGame: {
          ...defaultPlayerGame,
          triviaItem: correctItem,
          guesses: [],
          guessesMax: 5,
        },
        fullItems: [correctItem, wrongItemFull],
        difficulty: "LEVEL_3", // Implicit Feedback
      })

      ;(generateImplicitHint as jest.Mock).mockReturnValue({
        feedback: "Custom Feedback",
        revealedHints: { director: true },
        hintInfo: [{ type: "director", value: "Nolan" }],
      })

      act(() => {
        result.current.makeGuess(wrongItemBasic)
      })

      const state = result.current
      expect(state.playerGame.hintsUsed?.director).toBe(true)
      expect(state.lastGuessResult?.feedback).toBe("Custom Feedback")
    })

    it("should not process guess if game is already over", () => {
      const { result } = renderHook(() => useGameStore())
      useGameStore.setState({
        playerGame: { ...defaultPlayerGame, correctAnswer: true },
      })

      act(() => {
        result.current.makeGuess({ id: 999 } as any)
      })

      expect(result.current.playerGame.guesses).toHaveLength(0)
    })
  })

  describe("useHint", () => {
    it("should not deduct hint if strategy is not USER_SPEND", () => {
      const { result } = renderHook(() => useGameStore())

      act(() => {
        useGameStore.setState({
          difficulty: "LEVEL_3", // Implicit
          playerStats: { ...defaultPlayerStats, hintsAvailable: 5 },
        })
      })

      act(() => {
        result.current.useHint("director")
      })

      expect(result.current.playerStats.hintsAvailable).toBe(5)
      expect(result.current.playerGame.hintsUsed?.director).toBeUndefined()
    })

    it("should not deduct hint if 0 hints available", () => {
      const { result } = renderHook(() => useGameStore())

      act(() => {
        useGameStore.setState({
          difficulty: "LEVEL_2", // User Spend
          playerStats: { ...defaultPlayerStats, hintsAvailable: 0 },
        })
      })

      act(() => {
        result.current.useHint("director")
      })

      expect(result.current.playerGame.hintsUsed?.director).toBeUndefined()
    })
  })

  describe("giveUp", () => {
    it("should mark game gaveUp and handle save error", async () => {
      const { result } = renderHook(() => useGameStore())
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {})

      ;(gameService.savePlayerProgress as jest.Mock).mockRejectedValue(
        new Error("Save Fail")
      )

      await act(async () => {
        result.current.giveUp()
      })

      expect(result.current.playerGame.gaveUp).toBe(true)
      expect(result.current.flashMessage).toContain("Could not save progress")

      consoleSpy.mockRestore()
    })
  })

  describe("completeRevealSequence", () => {
    it("should set game status and show modal after delay", () => {
      const { result } = renderHook(() => useGameStore())

      act(() => {
        result.current.completeRevealSequence()
      })

      expect(result.current.gameStatus).toBe("gameOver")

      // Initial state of modal should be false
      expect(result.current.showModal).toBe(false)

      act(() => {
        jest.advanceTimersByTime(500)
      })

      expect(result.current.showModal).toBe(true)
    })
  })
})
