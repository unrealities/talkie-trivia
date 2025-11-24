import { act, renderHook } from "@testing-library/react-native"
import { useGameStore } from "../../src/state/gameStore"
import { gameService } from "../../src/services/gameService"
import { getGameDataService } from "../../src/services/gameServiceFactory"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { analyticsService } from "../../src/utils/analyticsService"
import { defaultPlayerGame, defaultPlayerStats } from "../../src/models/default"
import { ASYNC_STORAGE_KEYS } from "../../src/config/constants"

// --- MOCKS ---
jest.mock("../../src/services/gameService")
jest.mock("../../src/services/gameServiceFactory")
jest.mock("../../src/utils/analyticsService")
jest.mock("../../src/utils/scoreUtils", () => ({
  calculateScore: jest.fn().mockReturnValue(500),
}))

// Helper to reset store
const resetStore = () => {
  const initialState = useGameStore.getState()
  useGameStore.setState(initialState, true)
}

// Mock Data
const mockPlayer = { id: "player_1", name: "Test Player" }

// Correct Daily Item
const mockDailyItem = {
  id: 100,
  title: "Correct Movie",
  description: "A movie about testing.",
  posterPath: "/test.jpg",
  releaseDate: "2023-01-01",
  metadata: {},
  hints: [
    { type: "director", label: "Director", value: "Nolan" },
    { type: "genre", label: "Genre", value: "Sci-Fi" },
  ],
}

// Wrong Item (Totally different hints to avoid implicit matching)
const mockWrongItemFull = {
  id: 200,
  title: "Wrong Movie",
  description: "A different movie.",
  posterPath: "/wrong.jpg",
  releaseDate: "2020-01-01",
  metadata: {},
  hints: [
    { type: "director", label: "Director", value: "Spielberg" },
    { type: "genre", label: "Genre", value: "Adventure" },
  ],
}

const mockBasicItems = [
  {
    id: 100,
    title: "Correct Movie",
    releaseDate: "2023",
    posterPath: "/test.jpg",
  },
  {
    id: 200,
    title: "Wrong Movie",
    releaseDate: "2020",
    posterPath: "/wrong.jpg",
  },
]
const mockFullItems = [mockDailyItem, mockWrongItemFull]

const mockDataService = {
  getDailyTriviaItemAndLists: jest.fn().mockResolvedValue({
    dailyItem: mockDailyItem,
    fullItems: mockFullItems,
    basicItems: mockBasicItems,
  }),
  getItemById: jest.fn(),
  mode: "movies",
}

describe("GameStore: Comprehensive Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetStore()

    ;(getGameDataService as jest.Mock).mockReturnValue(mockDataService)

    ;(gameService.fetchOrCreatePlayerGame as jest.Mock).mockResolvedValue({
      ...defaultPlayerGame,
      id: "game_1",
      playerID: mockPlayer.id,
      triviaItem: mockDailyItem,
      guessesMax: 5,
    })

    ;(gameService.fetchOrCreatePlayerStats as jest.Mock).mockResolvedValue({
      ...defaultPlayerStats,
      id: mockPlayer.id,
      hintsAvailable: 5,
    })
  })

  describe("Initialization Flow", () => {
    it("should initialize correctly and set playing status", async () => {
      const { result } = renderHook(() => useGameStore())
      await act(async () => {
        await result.current.initializeGame(mockPlayer)
      })
      expect(result.current.loading).toBe(false)
      expect(result.current.gameStatus).toBe("playing")
      expect(result.current.playerGame.triviaItem.id).toBe(100)
    })

    it("should trigger onboarding tip if storage key is missing", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === ASYNC_STORAGE_KEYS.TUTORIAL_GUESS_INPUT_SEEN)
          return Promise.resolve(null)
        return Promise.resolve("some-value")
      })

      const { result } = renderHook(() => useGameStore())
      await act(async () => {
        await result.current.initializeGame(mockPlayer)
      })
      expect(result.current.tutorialState.showGuessInputTip).toBe(true)
      expect(analyticsService.trackOnboardingStarted).toHaveBeenCalled()
    })
  })

  describe("Gameplay: Guesses & Scoring", () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useGameStore())
      await act(async () => {
        await result.current.initializeGame(mockPlayer)
      })
    })

    it("should process a wrong guess correctly", async () => {
      const { result } = renderHook(() => useGameStore())
      const wrongItem = mockBasicItems[1] // ID 200

      await act(async () => {
        result.current.makeGuess(wrongItem)
      })

      expect(result.current.playerGame.guesses).toHaveLength(1)
      expect(result.current.playerGame.guesses[0].itemId).toBe(200)
      expect(result.current.playerGame.correctAnswer).toBe(false)
      expect(result.current.lastGuessResult?.feedback).toBe(
        "Not quite! Try again."
      )
      expect(analyticsService.trackGuessMade).toHaveBeenCalledWith(
        1,
        false,
        200,
        "Wrong Movie"
      )
    })

    it("should process a correct guess and trigger win flow", async () => {
      const { result } = renderHook(() => useGameStore())
      const correctItem = mockBasicItems[0] // ID 100

      await act(async () => {
        result.current.makeGuess(correctItem)
      })

      expect(result.current.playerGame.correctAnswer).toBe(true)
      expect(result.current.showConfetti).toBe(true)
      expect(gameService.savePlayerProgress).toHaveBeenCalled()
      expect(result.current.isInteractionsDisabled).toBe(true)
      expect(result.current.playerStats.allTimeScore).toBe(500)
      expect(result.current.playerStats.currentStreak).toBe(1)
    })
  })

  describe("Gameplay: Hints", () => {
    it("should decrement hintsAvailable when a hint is purchased (USER_SPEND mode)", async () => {
      const { result } = renderHook(() => useGameStore())
      await act(async () => {
        await result.current.initializeGame(mockPlayer)
      })
      act(() => {
        result.current.setDifficulty("LEVEL_2")
      })
      expect(result.current.playerStats.hintsAvailable).toBe(5)
      act(() => {
        result.current.useHint("director")
      })
      expect(result.current.playerGame.hintsUsed?.director).toBe(true)
      expect(result.current.playerStats.hintsAvailable).toBe(4)
    })

    it("should generate implicit hints in Medium mode", async () => {
      const { result } = renderHook(() => useGameStore())
      await act(async () => {
        await result.current.initializeGame(mockPlayer)
      })
      act(() => {
        result.current.setDifficulty("LEVEL_3")
      })

      // Setup a partial match scenario
      const wrongItemWithSharedDirector = {
        ...mockDailyItem,
        id: 300,
        title: "Shared Director Movie",
      }

      act(() => {
        useGameStore.setState((state) => ({
          fullItems: [...state.fullItems, wrongItemWithSharedDirector],
        }))
      })

      const guessItem = {
        id: 300,
        title: "Shared Director Movie",
        releaseDate: "2023",
        posterPath: "",
      }

      await act(async () => {
        result.current.makeGuess(guessItem)
      })
      expect(result.current.lastGuessResult?.feedback).toContain("right track")
      expect(result.current.playerGame.hintsUsed?.director).toBe(true)
    })
  })
})
