import { GameHistoryEntry } from "../../../models/gameHistory"
import { Timestamp } from "firebase/firestore"
import { DEFAULT_DIFFICULTY } from "../../../config/difficulty"

export const gameHistoryEntryConverter = {
  toFirestore: (entry: GameHistoryEntry) => {
    return {
      dateId: entry.dateId,
      movieId: entry.movieId,
      movieTitle: entry.movieTitle,
      posterPath: entry.posterPath,
      wasCorrect: entry.wasCorrect,
      gaveUp: entry.gaveUp,
      guessCount: entry.guessCount,
      guessesMax: entry.guessesMax,
      difficulty: entry.difficulty,
      createdAt: Timestamp.now(),
    }
  },
  fromFirestore: (snapshot: any, options: any): GameHistoryEntry => {
    const data = snapshot.data(options)
    return {
      dateId: data.dateId,
      movieId: data.movieId,
      movieTitle: data.movieTitle,
      posterPath: data.posterPath,
      wasCorrect: data.wasCorrect,
      gaveUp: data.gaveUp,
      guessCount: data.guessCount,
      guessesMax: data.guessesMax,
      difficulty: data.difficulty || DEFAULT_DIFFICULTY,
    }
  },
}
