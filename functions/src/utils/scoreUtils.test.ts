import { calculateScore } from "./scoreUtils"

describe("Utils: scoreUtils (Server)", () => {
  const baseGame = {
    correctAnswer: true,
    difficulty: "LEVEL_3",
    guesses: [{}, {}, {}], // 3 guesses
    guessesMax: 5,
    hintsUsed: {},
  }

  it("should return 0 if answer is incorrect", () => {
    const score = calculateScore({ ...baseGame, correctAnswer: false })
    expect(score).toBe(0)
  })

  it("should calculate correct score for Medium (Level 3)", () => {
    // Level 3: Max 700. Range 60%. Pool = 420. Base = 280.
    // 3 guesses used out of 5.
    // Perf Factor = (5 - 3) / (5 - 1) = 2/4 = 0.5.
    // Earned = 420 * 0.5 = 210.
    // Total = 280 + 210 = 490.
    const score = calculateScore(baseGame)
    expect(score).toBe(490)
  })

  it("should calculate correct score for Hard (Level 4) on first try", () => {
    // Level 4: Max 850.
    const score = calculateScore({
      ...baseGame,
      difficulty: "LEVEL_4",
      guesses: [{}], // 1 guess
    })
    // 1 guess = Max score
    expect(score).toBe(850)
  })

  it("should apply hint penalty for Easy (Level 2)", () => {
    // Level 2: Max 550. Range 65%. Pool ~357. Base ~192.
    // 1 guess = 550 raw.
    // 2 hints used = -100 penalty.
    const score = calculateScore({
      ...baseGame,
      difficulty: "LEVEL_2",
      guesses: [{}],
      hintsUsed: { a: true, b: true },
    })
    expect(score).toBe(450)
  })

  it("should prevent negative scores", () => {
    const score = calculateScore({
      ...baseGame,
      difficulty: "LEVEL_2",
      guesses: [{}, {}, {}, {}, {}], // Max guesses (low score)
      hintsUsed: { a: true, b: true, c: true, d: true, e: true, f: true }, // Excessive hints
    })
    expect(score).toBe(0)
  })
})
