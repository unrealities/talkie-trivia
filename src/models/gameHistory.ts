import { DifficultyLevel } from "../config/difficulty"

export interface GameHistoryEntry {
  dateId: string // YYYY-MM-DD
  movieId: number
  movieTitle: string
  posterPath: string
  wasCorrect: boolean
  gaveUp: boolean
  guessCount: number
  guessesMax: number
  difficulty: DifficultyLevel
}
