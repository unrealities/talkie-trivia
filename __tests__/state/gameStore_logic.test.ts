import { useGameStore } from "../../src/state/gameStore"
import { gameService } from "../../src/services/gameService"
import { defaultPlayerGame, defaultPlayerStats } from "../../src/models/default"
import { calculateScore } from "../../src/utils/scoreUtils"
import { act } from "@testing-library/react-native"

// Mocks
jest.mock("../../src/services/gameService")
jest.mock("../../src/utils/scoreUtils")
jest.mock("../../src/services/gameServiceFactory") // To prevent real API calls during init

describe("GameStore Logic", () => {
  const initialState = useGameStore.getState()

  beforeEach(() => {
    jest.clearAllMocks()
    useGameStore.setState(initialState, true) // Reset store
    ;(calculateScore as jest.Mock).mockReturnValue(100)
  })

  describe("_processGameOver", () => {
    it("should calculate scores, update stats, and save to firebase on Win", async () => {
      // 1. Setup State: A winning scenario
      useGameStore.setState({
        playerGame: {
          ...defaultPlayerGame,
          correctAnswer: true,
          guesses: [{}, {}], // 2 guesses
          guessesMax: 5,
          playerID: "p1",
        },
        playerStats: {
          ...defaultPlayerStats,
          games: 10,
          currentStreak: 5,
          wins: [0, 0, 0, 0, 0],
        },
        gameMode: "movies",
      })

      // 2. Execute
      await act(async () => {
        await useGameStore.getState()._processGameOver()
      })

      // 3. Assert Service Call
      expect(gameService.savePlayerProgress).toHaveBeenCalledTimes(1)

      // Check arguments passed to savePlayerProgress
      // Args: (playerGame, playerStats, historyEntry)
      const callArgs = (gameService.savePlayerProgress as jest.Mock).mock
        .calls[0]
      const updatedStats = callArgs[1]

      // 4. Verify Stat Calculations
      expect(updatedStats.games).toBe(11) // 10 + 1
      expect(updatedStats.currentStreak).toBe(6) // 5 + 1
      expect(updatedStats.allTimeScore).toBe(100) // 0 + 100 (mocked score)
      // Wins array index 1 (2nd guess) should be incremented
      expect(updatedStats.wins[1]).toBe(1)
    })

    it("should reset streak on Loss", async () => {
      useGameStore.setState({
        playerGame: {
          ...defaultPlayerGame,
          correctAnswer: false,
          guessesMax: 5,
          guesses: [{}, {}, {}, {}, {}], // Max guesses reached
          playerID: "p1",
        },
        playerStats: {
          ...defaultPlayerStats,
          currentStreak: 10, // High streak
        },
      })

      await act(async () => {
        await useGameStore.getState()._processGameOver()
      })

      const callArgs = (gameService.savePlayerProgress as jest.Mock).mock
        .calls[0]
      const updatedStats = callArgs[1]

      expect(updatedStats.currentStreak).toBe(0)
    })

    it("should handle save errors gracefully by setting error state", async () => {
      useGameStore.setState({
        playerGame: {
          ...defaultPlayerGame,
          correctAnswer: true,
          playerID: "p1",
        },
      })

      const errorMsg = "Firebase Write Failed"
      ;(gameService.savePlayerProgress as jest.Mock).mockRejectedValue(
        new Error(errorMsg)
      )

      // Expect the promise to reject, or check if state.error is set if caught internally
      try {
        await act(async () => {
          await useGameStore.getState()._processGameOver()
        })
      } catch (e) {
        // Expected
      }

      expect(useGameStore.getState().error).toContain(errorMsg)
    })
  })
})
