import { playerGameConverter } from "../../src/utils/firestore/converters/playerGame"
import { Timestamp } from "firebase/firestore"
import { defaultPlayerGame } from "../../src/models/default"

describe("Firestore Converter: PlayerGame", () => {
  // Mock data helpers
  const mockDate = new Date("2023-01-01T12:00:00.000Z")
  // Use the mocked Timestamp class
  const mockTimestamp = Timestamp.fromDate(mockDate)

  const mockPlayerGame = {
    ...defaultPlayerGame,
    id: "test-game-1",
    playerID: "player-1",
    guesses: [{ itemId: 101 }],
    correctAnswer: true,
    difficulty: "LEVEL_3",
    startDate: mockDate,
    endDate: mockDate,
  }

  describe("toFirestore", () => {
    it("should flatten the object and handle optional fields correctly", () => {
      // @ts-ignore
      const result = playerGameConverter.toFirestore(mockPlayerGame)

      expect(result).toEqual(
        expect.objectContaining({
          id: "test-game-1",
          playerID: "player-1",
          correctAnswer: true,
          difficulty: "LEVEL_3",
          statsProcessed: false, // Default check
        })
      )

      // Ensure complex objects are passed through
      expect(result.guesses).toHaveLength(1)
      expect(result.guesses[0].itemId).toBe(101)
    })

    it("should default difficulty if missing", () => {
      const gameMissingDiff = { ...mockPlayerGame, difficulty: undefined }
      // @ts-ignore
      const result = playerGameConverter.toFirestore(gameMissingDiff)
      expect(result.difficulty).toBe("LEVEL_3") // Default fallback
    })
  })

  describe("fromFirestore", () => {
    it("should correctly convert Firestore Timestamps to JS Dates", () => {
      const snapshot = {
        data: () => ({
          id: "test-game-1",
          playerID: "player-1",
          guesses: [],
          startDate: mockTimestamp, // Firestore format
          endDate: mockTimestamp, // Firestore format
          difficulty: "LEVEL_4",
        }),
      }

      // @ts-ignore
      const result = playerGameConverter.fromFirestore(snapshot, {})

      expect(result.startDate).toBeInstanceOf(Date)
      expect(result.startDate.toISOString()).toBe(mockDate.toISOString())
      expect(result.difficulty).toBe("LEVEL_4")
    })

    it("should handle legacy string dates if present", () => {
      const snapshot = {
        data: () => ({
          startDate: "2023-01-01T12:00:00.000Z", // String format
          endDate: "2023-01-01T12:00:00.000Z",
        }),
      }

      // @ts-ignore
      const result = playerGameConverter.fromFirestore(snapshot, {})
      expect(result.startDate).toBeInstanceOf(Date)
    })

    it("should merge with defaultPlayerGame structure to prevent undefined errors", () => {
      const snapshot = {
        data: () => ({
          id: "partial-data",
          // Missing guesses, statsProcessed, etc.
        }),
      }

      // @ts-ignore
      const result = playerGameConverter.fromFirestore(snapshot, {})

      // Should have defaults filled in
      expect(result.guesses).toEqual([])
      expect(result.statsProcessed).toBe(false)
    })
  })
})
