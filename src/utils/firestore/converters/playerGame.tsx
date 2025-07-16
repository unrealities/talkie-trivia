import { PlayerGame } from "../../../models/game"
import { defaultPlayerGame } from "../../../models/default"
import { Timestamp } from "firebase/firestore"

export const playerGameConverter = {
  /**
   * Converts a PlayerGame object to a Firestore-compatible object.
   * The Firestore SDK automatically handles converting JS Date objects to Timestamps.
   */
  toFirestore: (playerGame: PlayerGame) => {
    return {
      id: playerGame.id,
      playerID: playerGame.playerID,
      movie: playerGame.movie,
      guessesMax: playerGame.guessesMax,
      guesses: playerGame.guesses,
      correctAnswer: playerGame.correctAnswer,
      gaveUp: playerGame.gaveUp,
      startDate: playerGame.startDate,
      endDate: playerGame.endDate,
      hintsUsed: playerGame.hintsUsed || {},
      statsProcessed: playerGame.statsProcessed || false,
    }
  },

  /**
   * Converts a Firestore document snapshot into a PlayerGame object.
   * This version assumes the data is always in the new, flat format.
   */
  fromFirestore: (snapshot: any, options: any): PlayerGame => {
    const data = snapshot.data(options)

    // Helper to safely convert Firestore Timestamps back to JS Dates.
    const safeToDate = (field: any): Date => {
      if (field instanceof Timestamp) {
        return field.toDate()
      }
      return field // Assumes it might already be a Date object
    }

    return {
      ...defaultPlayerGame,
      ...data,
      startDate: safeToDate(data.startDate),
      endDate: safeToDate(data.endDate),
    }
  },
}
