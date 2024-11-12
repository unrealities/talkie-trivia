import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { playerConverter } from "./firestore/converters/player"
import { playerGameConverter } from "./firestore/converters/playerGame"
import { playerStatsConverter } from "./firestore/converters/playerStats"

export const updatePlayer = async (
  player,
  getUserID,
  getUserName,
  setUserName
) => {
  const docRef = doc(db, "players", player.id).withConverter(playerConverter)
  try {
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      player.id = await getUserID()
      player.name = await getUserName()
      await setDoc(docRef, player)
      setUserName(player.name)
      return true // Indicating an update occurred
    }
    return false
  } catch (e) {
    console.error("Error updating player document:", e)
    return false
  }
}

export const updatePlayerGame = async (playerGame) => {
  const docRef = doc(db, "playerGames", playerGame.id).withConverter(
    playerGameConverter
  )
  try {
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      await updateDoc(docRef, playerGame)
    } else {
      await setDoc(docRef, playerGame)
    }
    return true // Update occurred
  } catch (e) {
    console.error("Error updating player game document:", e)
    return false
  }
}

export const updatePlayerStats = async (playerStats, playerId) => {
  const docRef = doc(db, "playerStats", playerId).withConverter(
    playerStatsConverter
  )
  try {
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const dbPlayerStats = docSnap.data()
      dbPlayerStats.games += 1
      await updateDoc(docRef, dbPlayerStats)
      return { stats: dbPlayerStats, updated: true } // Indicate if update occurred
    } else {
      await setDoc(docRef, playerStats)
      return { stats: playerStats, updated: false }
    }
  } catch (e) {
    console.error("Error updating player stats document:", e)
    return { stats: null, updated: false }
  }
}
