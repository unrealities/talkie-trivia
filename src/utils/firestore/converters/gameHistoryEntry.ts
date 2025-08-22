import { GameHistoryEntry } from "../../../models/gameHistory"
import { Timestamp } from "firebase/firestore"

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
      createdAt: Timestamp.now(),
    }
  },
  fromFirestore: (snapshot: any, options: any): GameHistoryEntry => {
    const data = snapshot.data(options)
    return new GameHistoryEntry(
      data.dateId,
      data.movieId,
      data.movieTitle,
      data.posterPath,
      data.wasCorrect,
      data.gaveUp,
      data.guessCount,
      data.guessesMax
    )
  },
}
