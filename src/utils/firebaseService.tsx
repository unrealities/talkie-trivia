import { doc, writeBatch } from "firebase/firestore"
import { db } from "../config/firebase"
import { playerStatsConverter } from "./firestore/converters/playerStats"
import { playerGameConverter } from "./firestore/converters/playerGame"
import { playerConverter } from "./firestore/converters/player"

export const batchUpdatePlayerData = async (
  playerStats,
  playerGame,
  playerId,
  playerUpdate = null
) => {
  if (!playerId) {
    console.error("batchUpdatePlayerData: Error - Player ID is required.")
    throw new Error("Player ID is required for updating player data.")
  }

  const batch = writeBatch(db)

  // Only create statsDocRef if playerStats is not empty
  if (playerStats && Object.keys(playerStats).length > 0) {
    const statsDocRef = doc(db, "playerStats", playerId).withConverter(
      playerStatsConverter
    )
    batch.set(statsDocRef, playerStats, { merge: true })
  }

  // Only create gameDocRef if playerGame is not empty
  if (playerGame && Object.keys(playerGame).length > 0) {
    const gameDocRef = doc(db, "playerGames", playerGame.id).withConverter(
      playerGameConverter
    )
    batch.set(gameDocRef, playerGame, { merge: true })
  }

  // Update player document only if playerUpdate is provided
  if (playerUpdate) {
    const playerDocRef = doc(db, "players", playerId).withConverter(
      playerConverter
    )
    batch.set(playerDocRef, playerUpdate, { merge: true })
  }

  try {
    await batch.commit()
    console.log("batchUpdatePlayerData: Batch update successful.")
    return { success: true }
  } catch (error) {
    console.error("batchUpdatePlayerData: Batch update failed:", error)
    return { success: false }
  }
}
