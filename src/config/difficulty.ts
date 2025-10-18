/**
 * Internal, machine-readable identifiers for difficulty levels.
 */
export type DifficultyLevel =
  | "LEVEL_1"
  | "LEVEL_2"
  | "LEVEL_3"
  | "LEVEL_4"
  | "LEVEL_5"

/**
 * Defines the core mechanism for how hints/clues are handled in this difficulty.
 */
export type HintStrategy =
  | "ALL_REVEALED"
  | "USER_SPEND"
  | "IMPLICIT_FEEDBACK"
  | "NONE_DISABLED"
  | "EXTREME_CHALLENGE"

export interface DifficultyMode {
  label: string
  description: string
  guessesMax: number
  hintStrategy: HintStrategy
  scoreMultiplier: number
  scoreRangePercentage: number
}

/**
 * Default difficulty used when the user has no preference stored.
 */
export const DEFAULT_DIFFICULTY: DifficultyLevel = "LEVEL_3"

/**
 * Centralized mapping of internal difficulty levels to their configuration.
 */
export const DIFFICULTY_MODES: Record<DifficultyLevel, DifficultyMode> = {
  LEVEL_1: {
    label: "Basic",
    description:
      "All movie facts and hints are revealed at the start of the game.",
    guessesMax: 5,
    hintStrategy: "ALL_REVEALED",
    scoreMultiplier: 0.4, // Max score: 400
    scoreRangePercentage: 0.75,
  },
  LEVEL_2: {
    label: "Easy",
    description:
      "Reveal clues gradually. You can use earned hint points to reveal specific hints like Decade, Director, Actor, or Genre.",
    guessesMax: 5,
    hintStrategy: "USER_SPEND",
    scoreMultiplier: 0.55, // Max score: 550
    scoreRangePercentage: 0.65,
  },
  LEVEL_3: {
    label: "Medium",
    description:
      "Hints are automatically revealed when you make a guess that shares a category (like actor or decade) with the correct movie.",
    guessesMax: 5,
    hintStrategy: "IMPLICIT_FEEDBACK",
    scoreMultiplier: 0.7, // Max score: 700
    scoreRangePercentage: 0.6,
  },
  LEVEL_4: {
    label: "Hard",
    description:
      "A pure test of knowledge. No hints are available or revealed throughout the game.",
    guessesMax: 5,
    hintStrategy: "NONE_DISABLED",
    scoreMultiplier: 0.85, // Max score: 850
    scoreRangePercentage: 0.5,
  },
  LEVEL_5: {
    label: "Extreme",
    description:
      "The ultimate challenge. You only get 3 guesses, clues are revealed more slowly, and no hints are available.",
    guessesMax: 3,
    hintStrategy: "EXTREME_CHALLENGE",
    scoreMultiplier: 1.0, // Max score: 1000
    scoreRangePercentage: 0.4,
  },
}

export type Difficulty = DifficultyLevel
