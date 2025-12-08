import { DIFFICULTY_MODES, DifficultyLevel } from "./difficulty"

const MAX_SCORE = 1000
const HINT_PENALTY = 50

interface GameData {
  correctAnswer: boolean
  difficulty: string
  guesses: any[]
  guessesMax: number
  hintsUsed?: Record<string, boolean>
}

export function calculateScore(game: GameData): number {
  if (!game.correctAnswer) {
    return 0
  }

  const difficulty = game.difficulty as DifficultyLevel
  const guessesUsed = game.guesses.length
  const guessesMax = game.guessesMax

  const difficultyMode = DIFFICULTY_MODES[difficulty]
  // If invalid difficulty, fallback or return 0 (prevent cheating with custom levels)
  if (!difficultyMode) return 0

  const maxScoreForDifficulty = MAX_SCORE * difficultyMode.scoreMultiplier
  const performancePointsPool =
    maxScoreForDifficulty * difficultyMode.scoreRangePercentage
  const baseWinPoints = maxScoreForDifficulty - performancePointsPool

  const performanceFactor =
    guessesMax > 1 ? (guessesMax - guessesUsed) / (guessesMax - 1) : 1
  const earnedPerformancePoints = performancePointsPool * performanceFactor

  let hintPenaltyTotal = 0
  // Only penalize in Level 2 (Easy) as other levels handle hints via mechanics
  if (difficulty === "LEVEL_2" && game.hintsUsed) {
    const manualHintsCount = Object.values(game.hintsUsed).filter(
      Boolean
    ).length
    hintPenaltyTotal = manualHintsCount * HINT_PENALTY
  }

  return Math.max(
    0,
    Math.round(baseWinPoints + earnedPerformancePoints - hintPenaltyTotal)
  )
}
