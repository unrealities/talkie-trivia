import { doc, getDoc, writeBatch } from "firebase/firestore"
import { db } from "../config/firebase"
import { playerStatsConverter } from "./firestore/converters/playerStats"
import { playerGameConverter } from "./firestore/converters/playerGame"
import { gameHistoryEntryConverter } from "./firestore/converters/gameHistoryEntry"
import PlayerStats from "../models/playerStats"
import { PlayerGame } from "../models/game"
import Player from "../models/player"
import { GameHistoryEntry } from "../models/gameHistory"
import { Movie } from "../models/movie"

export const fetchMovieById = async (
  movieId: number
): Promise<Movie | null> => {
  if (!movieId) return null
  try {
    const movieDocRef = doc(db, "movies", movieId.toString())
    const movieSnap = await getDoc(movieDocRef)
    if (movieSnap.exists()) {
      return movieSnap.data() as Movie
    }
    console.warn(`Movie with ID ${movieId} not found in Firestore.`)
    return null
  } catch (error) {
    console.error(`Error fetching movie with ID ${movieId}:`, error)
    throw error
  }
}

export const batchUpdatePlayerData = async (
  playerStats: PlayerStats,
  playerGame: PlayerGame,
  playerId: string,
  gameHistoryEntry: GameHistoryEntry | null = null,
  playerUpdate: Partial<Player> | null = null
): Promise<{ success: boolean }> => {
  if (__DEV__) {
    console.log("batchUpdatePlayerData called with:", {
      playerStats,
      playerGame,
      playerId,
      gameHistoryEntry,
      playerUpdate,
    })
  }

  if (!playerId) {
    console.warn(
      "batchUpdatePlayerData: Warning - Player ID is missing. Data update may not be accurate."
    )
    throw new Error("Player ID is required for updating player data.")
  }

  const batch = writeBatch(db)

  if (playerStats && Object.keys(playerStats).length > 0) {
    const statsDocRef = doc(db, "playerStats", playerId).withConverter(
      playerStatsConverter
    )
    batch.set(statsDocRef, playerStats, { merge: true })
  }

  if (playerGame && playerGame.id && playerGame.movie?.id !== 0) {
    const gameDocRef = doc(db, "playerGames", playerGame.id).withConverter(
      playerGameConverter
    )
    batch.set(gameDocRef, playerGame, { merge: true })
  }

  if (gameHistoryEntry) {
    const historyDocRef = doc(
      db,
      `players/${playerId}/gameHistory`,
      gameHistoryEntry.dateId
    ).withConverter(gameHistoryEntryConverter)
    batch.set(historyDocRef, gameHistoryEntry)
  }

  if (playerUpdate && Object.keys(playerUpdate).length > 0) {
    const playerDocRef = doc(db, "players", playerId)
    batch.update(playerDocRef, playerUpdate)
  }

  try {
    await batch.commit()
    if (__DEV__) {
      console.log("batchUpdatePlayerData: Batch update successful.")
    }
    return { success: true }
  } catch (error) {
    console.error("batchUpdatePlayerData: Batch update failed:", error)
    throw error
  }
}
