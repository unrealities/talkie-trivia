import { calculateScore } from "../src/utils/scoreUtils"
import { defaultPlayerGame } from "../src/models/default"
import { PlayerGame } from "../src/models/game"

describe("Utils: scoreUtils", () => {
  const baseGame: PlayerGame = {
    ...defaultPlayerGame,
    correctAnswer: true,
    guessesMax: 5,
    difficulty: "LEVEL_3", // Medium
    hintsUsed: {},
  }

  describe("calculateScore", () => {
    it("should return 0 if the answer is incorrect", () => {
      const game: PlayerGame = { ...baseGame, correctAnswer: false }
      expect(calculateScore(game)).toBe(0)
    })

    it("should return max score for 1st guess in Hard mode", () => {
      // Level 4 multiplier is 0.85. Max base is 1000.
      // Expected: 850
      const game: PlayerGame = {
        ...baseGame,
        difficulty: "LEVEL_4",
        guesses: [{ itemId: 1 }], // 1 guess used
        guessesMax: 5,
      }
      expect(calculateScore(game)).toBe(850)
    })

    it("should calculate correct degradation for Medium mode", () => {
      // Level 3 (Medium): Multiplier 0.7 (Max 700). Range % is 0.6.
      // Max = 700. Pool = 700 * 0.6 = 420. Base = 280.
      // 5 Guesses Max.
      // 1 guess:  280 + 420 * (4/4) = 700
      // 3 guesses: 280 + 420 * (2/4) = 490

      const game: PlayerGame = {
        ...baseGame,
        difficulty: "LEVEL_3",
        guesses: [{}, {}, {}], // 3 guesses
        guessesMax: 5,
      }
      expect(calculateScore(game)).toBe(490)
    })

    it("should return base win points for the last possible guess", () => {
      // Level 3. Base win points = 280.
      const game: PlayerGame = {
        ...baseGame,
        difficulty: "LEVEL_3",
        guesses: [{}, {}, {}, {}, {}], // 5 guesses (max)
        guessesMax: 5,
      }
      expect(calculateScore(game)).toBe(280)
    })

    it("should deduct points for hints used in Level 2 (Easy)", () => {
      // Level 2: Multiplier 0.55 (550 Max). Range 0.65.
      // Pool = 550 * 0.65 = 357.5. Base = 192.5.
      // 1 guess = 550.
      // Penalty = 50 per hint.
      const game: PlayerGame = {
        ...baseGame,
        difficulty: "LEVEL_2",
        guesses: [{ itemId: 1 }],
        hintsUsed: { director: true, genre: true }, // 2 hints
      }

      // Expected: 550 - (2 * 50) = 450
      expect(calculateScore(game)).toBe(450)
    })

    it("should not return negative scores", () => {
      // Force a scenario where penalties exceed score
      const game: PlayerGame = {
        ...baseGame,
        difficulty: "LEVEL_2", // Easy
        guesses: [{}, {}, {}, {}, {}], // Last guess (low base score)
        // Excessive hints to drive score negative
        hintsUsed: { a: true, b: true, c: true, d: true, e: true, f: true },
        guessesMax: 5,
      }
      // Even if math goes negative, function should return 0 or minimum floor
      expect(calculateScore(game)).toBeGreaterThanOrEqual(0)
    })

    it("should handle unknown difficulty gracefully", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {})
      const game: PlayerGame = {
        ...baseGame,
        // @ts-ignore
        difficulty: "LEVEL_999",
      }
      expect(calculateScore(game)).toBe(0)
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})
