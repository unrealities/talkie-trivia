import { Movie } from "./movie"

export type Difficulty = "very easy" | "easy" | "medium" | "hard" | "very hard"

export type HintType = "decade" | "director" | "actor" | "genre"

export interface HintInfo {
  type: HintType
  value: string
}

export interface PlayerGame {
  id: string // Unique ID for this player-game session, e.g., "player1-2025-07-16"
  playerID: string
  movie: Movie
  guessesMax: number
  guesses: number[]
  correctAnswer: boolean
  gaveUp: boolean
  startDate: Date
  endDate: Date
  hintsUsed?: Partial<Record<HintType, boolean>>
  statsProcessed?: boolean
}
