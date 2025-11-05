import { PlayerGame } from "../../../models/game"
import { defaultPlayerGame } from "../../../models/default"
import { DEFAULT_DIFFICULTY } from "../../../config/difficulty"
import { Timestamp } from "firebase/firestore"

export const playerGameConverter = {
  toFirestore: (playerGame: PlayerGame) => {
    return {
      id: playerGame.id,
      playerID: playerGame.playerID,
      triviaItem: playerGame.triviaItem,
      guessesMax: playerGame.guessesMax,
      difficulty: playerGame.difficulty || DEFAULT_DIFFICULTY,
      guesses: playerGame.guesses,
      correctAnswer: playerGame.correctAnswer,
      gaveUp: playerGame.gaveUp,
      startDate: playerGame.startDate,
      endDate: playerGame.endDate,
      hintsUsed: playerGame.hintsUsed || {},
      statsProcessed: playerGame.statsProcessed || false,
    }
  },

  fromFirestore: (snapshot: any, options: any): PlayerGame => {
    const data = snapshot.data(options)

    const safeToDate = (field: any): Date => {
      if (field instanceof Timestamp) {
        return field.toDate()
      }
      if (typeof field === "string") {
        return new Date(field)
      }
      return field
    }

    const gameData: Partial<PlayerGame> = {
      ...data,
      difficulty: data.difficulty || DEFAULT_DIFFICULTY,
      startDate: safeToDate(data.startDate),
      endDate: safeToDate(data.endDate),
    }

    if (data.movie && !data.triviaItem) {
      gameData.triviaItem = data.movie
      delete (gameData as any).movie
    }

    return {
      ...defaultPlayerGame,
      ...gameData,
    } as PlayerGame
  },
}
