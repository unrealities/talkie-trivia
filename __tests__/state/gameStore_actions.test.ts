import { useGameStore } from "../../src/state/gameStore"
import { gameService } from "../../src/services/gameService"
import { getGameDataService } from "../../src/services/gameServiceFactory"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { act } from "@testing-library/react-native"
import { analyticsService } from "../../src/utils/analyticsService"

// Mocks
jest.mock("../../src/services/gameService")
jest.mock("../../src/services/gameServiceFactory")
jest.mock("../../src/utils/analyticsService")

describe("GameStore Actions", () => {
  const initialState = useGameStore.getState()
  const mockDataService = {
    getDailyTriviaItemAndLists: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    useGameStore.setState(initialState, true)
    ;(getGameDataService as jest.Mock).mockReturnValue(mockDataService)
  })

  describe("initializeGame", () => {
    const mockPlayer = { id: "p1", name: "Player" }

    it("should successfully load game data and sync with AsyncStorage", async () => {
      // 1. Mock Data Service
      mockDataService.getDailyTriviaItemAndLists.mockResolvedValue({
        dailyItem: { id: 1 },
        fullItems: [],
        basicItems: [],
      })

      // 2. Mock Storage
      ;(AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        // The actual key is "difficulty_setting"
        if (key.includes("difficulty")) return Promise.resolve("LEVEL_2")
        return Promise.resolve(null)
      })

      // 3. Mock Game Service
      ;(gameService.fetchOrCreatePlayerGame as jest.Mock).mockResolvedValue({
        id: "game-1",
        guesses: [],
        correctAnswer: false,
        difficulty: "LEVEL_2", // Ensure the service returns it too if logic depends on it
      })
      ;(gameService.fetchOrCreatePlayerStats as jest.Mock).mockResolvedValue({})

      // 4. Execute
      await act(async () => {
        await useGameStore.getState().initializeGame(mockPlayer)
      })

      // 5. Assertions
      const state = useGameStore.getState()
      expect(state.loading).toBe(false)
      expect(state.difficulty).toBe("LEVEL_2")

      // Tutorial logic:
      // getItem returns null -> set tip to true
      expect(state.tutorialState.showGuessInputTip).toBe(true)
      expect(analyticsService.trackOnboardingStarted).toHaveBeenCalled()
    })

    it("should handle errors during initialization", async () => {
      mockDataService.getDailyTriviaItemAndLists.mockRejectedValue(
        new Error("API Fail")
      )

      await act(async () => {
        await useGameStore.getState().initializeGame(mockPlayer)
      })

      const state = useGameStore.getState()
      expect(state.loading).toBe(false)
      expect(state.error).toContain("API Fail")
      expect(state.isInteractionsDisabled).toBe(true)
    })
  })

  describe("setGameMode", () => {
    it("should prevent switching mode if current game is in progress", async () => {
      useGameStore.setState({
        gameMode: "movies",
        playerGame: {
          guesses: [{ itemId: 1 }],
          correctAnswer: false,
          gaveUp: false,
        } as any,
      })

      await act(async () => {
        await useGameStore.getState().setGameMode("videoGames")
      })

      expect(useGameStore.getState().gameMode).toBe("movies")
      expect(useGameStore.getState().flashMessage).toContain(
        "Finish the current game"
      )
    })
  })
})
