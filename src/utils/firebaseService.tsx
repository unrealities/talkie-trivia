import { doc, writeBatch, updateDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { playerStatsConverter } from "./firestore/converters/playerStats"
import { playerGameConverter } from "./firestore/converters/playerGame"

export const batchUpdatePlayerData = async (
  playerStats: any,
  playerGame: any,
  playerId: string,
  playerUpdate: any = null
): Promise<{ success: boolean }> => {
  console.log("batchUpdatePlayerData called with:", {
    playerStats,
    playerGame,
    playerId,
    playerUpdate,
  })

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

  if (
    playerGame &&
    Object.keys(playerGame).length > 0 &&
    playerGame.game.movie.id !== 0 &&
    playerGame.id
  ) {
    const gameDocRef = doc(db, "playerGames", playerGame.id).withConverter(
      playerGameConverter
    )
    batch.set(gameDocRef, playerGame, { merge: true })
  }

  if (playerUpdate && Object.keys(playerUpdate).length > 0) {
    const playerDocRef = doc(db, "players", playerId)
    batch.update(playerDocRef, playerUpdate)
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
