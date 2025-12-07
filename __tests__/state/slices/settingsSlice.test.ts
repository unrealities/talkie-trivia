import { act, renderHook } from "@testing-library/react-native"
import { useGameStore } from "../../../src/state/gameStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ASYNC_STORAGE_KEYS } from "../../../src/config/constants"
import {
  defaultPlayerGame,
  defaultPlayerStats,
} from "../../../src/models/default"

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
)

// Mock initializeGame to avoid full logic execution
const mockInitializeGame = jest.fn()

describe("State: Settings Slice", () => {
  const initialState = useGameStore.getState()

  beforeEach(() => {
    useGameStore.setState(
      {
        ...initialState,
        playerGame: { ...defaultPlayerGame, playerID: "p1" },
        playerStats: { ...defaultPlayerStats, id: "p1" },
        // @ts-ignore - injecting mock action
        initializeGame: mockInitializeGame,
      },
      true
    )
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe("setGameMode", () => {
    it("should switch mode and re-initialize if game is clean", async () => {
      const { result } = renderHook(() => useGameStore())

      await act(async () => {
        await result.current.setGameMode("videoGames")
      })

      expect(result.current.gameMode).toBe("videoGames")
      expect(mockInitializeGame).toHaveBeenCalledWith(
        expect.objectContaining({ id: "p1", name: "p1" })
      )
    })

    it("should do nothing if setting the same mode", async () => {
      const { result } = renderHook(() => useGameStore())
      await act(async () => {
        await result.current.setGameMode("movies")
      })
      expect(mockInitializeGame).not.toHaveBeenCalled()
    })

    it("should block switching if a game is in progress (and not finished)", async () => {
      const { result } = renderHook(() => useGameStore())

      // Simulate active game
      useGameStore.setState({
        playerGame: {
          ...defaultPlayerGame,
          guesses: [{ itemId: 1 }] as any,
          correctAnswer: false,
          gaveUp: false,
        } as any,
      })

      await act(async () => {
        await result.current.setGameMode("videoGames")
      })

      // Should NOT have changed mode
      expect(result.current.gameMode).toBe("movies")
      expect(result.current.flashMessage).toContain("Finish the current game")
      expect(mockInitializeGame).not.toHaveBeenCalled()

      // Verify flash message clears
      act(() => {
        jest.runAllTimers()
      })
      expect(result.current.flashMessage).toBeNull()
    })
  })

  describe("setDifficulty", () => {
    it("should update difficulty and save to storage", () => {
      const { result } = renderHook(() => useGameStore())

      act(() => {
        result.current.setDifficulty("LEVEL_2")
      })

      expect(result.current.difficulty).toBe("LEVEL_2")
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ASYNC_STORAGE_KEYS.DIFFICULTY_SETTING,
        "LEVEL_2"
      )
    })

    it("should show flash message when lowering difficulty rank mid-game", () => {
      const { result } = renderHook(() => useGameStore())

      // Start at Hard (Level 4)
      act(() => {
        useGameStore.setState({
          difficulty: "LEVEL_4",
          playerGame: { ...defaultPlayerGame, difficulty: "LEVEL_4" },
        })
      })

      // Switch to Easy (Level 2)
      act(() => {
        result.current.setDifficulty("LEVEL_2")
      })

      expect(result.current.flashMessage).toContain(
        "Score will be based on Easy mode"
      )
      expect(result.current.playerGame.difficulty).toBe("LEVEL_2")
    })
  })
})
