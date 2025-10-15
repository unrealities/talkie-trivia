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
  },
  LEVEL_2: {
    label: "Easy",
    description:
      "Reveal clues gradually. You can use earned hint points to reveal specific hints like Decade, Director, Actor, or Genre.",
    guessesMax: 5,
    hintStrategy: "USER_SPEND",
  },
  LEVEL_3: {
    label: "Medium",
    description:
      "Hints are automatically revealed when you make a guess that shares a category (like actor or decade) with the correct movie.",
    guessesMax: 5,
    hintStrategy: "IMPLICIT_FEEDBACK",
  },
  LEVEL_4: {
    label: "Hard",
    description:
      "A pure test of knowledge. No hints are available or revealed throughout the game.",
    guessesMax: 5,
    hintStrategy: "NONE_DISABLED",
  },
  LEVEL_5: {
    label: "Extreme",
    description:
      "The ultimate challenge. You only get 3 guesses, clues are revealed more slowly, and no hints are available.",
    guessesMax: 3,
    hintStrategy: "EXTREME_CHALLENGE",
  },
}

export type Difficulty = DifficultyLevel
