import { Movie } from "./movie"

export type Difficulty = "basic" | "easy" | "medium" | "hard" | "extreme"

export type HintType = "decade" | "director" | "actor" | "genre"

export interface HintInfo {
  type: HintType
  value: string
}

export interface Guess {
  movieId: number
  hintInfo?: HintInfo[] | null
}

export interface PlayerGame {
  id: string // Unique ID for this player-game session, e.g., "player1-2025-07-16"
  playerID: string
  movie: Movie
  guessesMax: number
  guesses: Guess[]
  correctAnswer: boolean
  gaveUp: boolean
  startDate: Date
  endDate: Date
  hintsUsed?: Partial<Record<HintType, boolean>>
  statsProcessed?: boolean
}
