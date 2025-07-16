import { Movie } from "./movie"

export class PlayerGame {
  id: string // Unique ID for this player-game session, e.g., "player1-2025-07-16"
  playerID: string
  movie: Movie // The movie for this game, directly on the object
  guessesMax: number
  guesses: number[]
  correctAnswer: boolean
  gaveUp: boolean
  startDate: Date
  endDate: Date
  hintsUsed?: {
    [guessNumber: number]: "decade" | "director" | "actor" | "genre"
  }
  statsProcessed?: boolean
}
