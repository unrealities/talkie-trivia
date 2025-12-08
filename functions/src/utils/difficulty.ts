export type DifficultyLevel =
  | "LEVEL_1"
  | "LEVEL_2"
  | "LEVEL_3"
  | "LEVEL_4"
  | "LEVEL_5"

export interface DifficultyMode {
  guessesMax: number
  scoreMultiplier: number
  scoreRangePercentage: number
}

export const DIFFICULTY_MODES: Record<DifficultyLevel, DifficultyMode> = {
  LEVEL_1: {
    guessesMax: 5,
    scoreMultiplier: 0.4,
    scoreRangePercentage: 0.75,
  },
  LEVEL_2: {
    guessesMax: 5,
    scoreMultiplier: 0.55,
    scoreRangePercentage: 0.65,
  },
  LEVEL_3: {
    guessesMax: 5,
    scoreMultiplier: 0.7,
    scoreRangePercentage: 0.6,
  },
  LEVEL_4: {
    guessesMax: 5,
    scoreMultiplier: 0.85,
    scoreRangePercentage: 0.5,
  },
  LEVEL_5: {
    guessesMax: 3,
    scoreMultiplier: 1.0,
    scoreRangePercentage: 0.4,
  },
}
