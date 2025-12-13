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

    it("should successfully initialize game (Happy Path)", async () => {
      const mockDailyItem = { id: 100, title: "Daily Movie" }
      const mockFullItems = [mockDailyItem]
      const mockBasicItems = [{ id: 100, title: "Daily Movie" }]

      ;(getGameDataService as jest.Mock).mockReturnValue({
        getDailyTriviaItemAndLists: jest.fn().mockResolvedValue({
          dailyItem: mockDailyItem,
          fullItems: mockFullItems,
          basicItems: mockBasicItems,
        }),
      })

      ;(gameService.fetchOrCreatePlayerGame as jest.Mock).mockResolvedValue({
        ...defaultPlayerGame,
        id: "new-game",
        triviaItem: mockDailyItem,
      })

      ;(gameService.fetchOrCreatePlayerStats as jest.Mock).mockResolvedValue(
        defaultPlayerStats
      )

      const { result } = renderHook(() => useGameStore())

      await act(async () => {
        await result.current.initializeGame(mockPlayer)
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.fullItems).toEqual(mockFullItems)
      expect(result.current.playerGame.id).toBe("new-game")
      expect(result.current.gameStatus).toBe("playing")
    })
  })

  describe("processGameOver", () => {
    it("should call submitGameResult and handle errors", async () => {
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

      // Mock failure
      ;(gameService.submitGameResult as jest.Mock).mockRejectedValue(
        new Error("Cloud Function Failed")
      )

      await act(async () => {
        try {
          await result.current.processGameOver()
        } catch (e) {
          // Expected to throw
        }
      })

      expect(gameService.submitGameResult).toHaveBeenCalled()
      expect(result.current.error).toContain("Failed to save progress")
    })

    it("should optimistically update stats immediately", async () => {
      const { result } = renderHook(() => useGameStore())
      useGameStore.setState({
        playerGame: {
          ...defaultPlayerGame,
          correctAnswer: true,
          statsProcessed: false,
        },
        playerStats: { ...defaultPlayerStats, games: 0 },
      })
      ;(gameService.submitGameResult as jest.Mock).mockResolvedValue({})

      await act(async () => {
        await result.current.processGameOver()
      })

      // Games count should increment locally
      expect(result.current.playerStats.games).toBe(1)
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
    })
  })

  describe("giveUp", () => {
    it("should mark game gaveUp", async () => {
      const { result } = renderHook(() => useGameStore())
      ;(gameService.submitGameResult as jest.Mock).mockResolvedValue({})

      await act(async () => {
        result.current.giveUp()
      })

      expect(result.current.playerGame.gaveUp).toBe(true)
    })
  })
})
