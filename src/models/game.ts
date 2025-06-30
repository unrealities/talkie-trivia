import { Movie } from "./movie"

export class Game {
  date: Date
  guessesMax: number
  id: string
  movie: Movie
}

export class PlayerGame {
  correctAnswer: boolean
  endDate: Date
  game: Game
  guesses: number[]
  id: string
  playerID: string
  startDate: Date
  hintsUsed?: {
    [guessNumber: number]: "decade" | "director" | "actor" | "genre"
  }
  gaveUp: boolean
  statsProcessed?: boolean
}
