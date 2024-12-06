import { doc, writeBatch } from "firebase/firestore"
import { db } from "../config/firebase"
import { playerStatsConverter } from "./firestore/converters/playerStats"
import { playerGameConverter } from "./firestore/converters/playerGame"

export const batchUpdatePlayerData = async (
  playerStats,
  playerGame,
  playerId
) => {
  if (!playerId) {
    throw new Error("Player ID is required for updating player data.")
  }

  const batch = writeBatch(db)
  const statsDocRef = doc(db, "playerStats", playerId).withConverter(
    playerStatsConverter
  )
  const gameDocRef = doc(db, "playerGames", playerGame.id).withConverter(
    playerGameConverter
  )

  batch.set(statsDocRef, playerStats, { merge: true })
  batch.set(gameDocRef, playerGame, { merge: true })

  try {
    await batch.commit()
    return { success: true }
  } catch (error) {
    console.error("Batch update failed:", error)
    return { success: false }
  }
}
