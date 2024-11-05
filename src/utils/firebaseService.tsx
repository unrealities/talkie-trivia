import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { playerConverter, playerGameConverter, playerStatsConverter } from './firestore/converters'

export const updatePlayer = async (player, getUserID, getUserName, setUserName) => {
  const docRef = doc(db, 'players', player.id).withConverter(playerConverter)
  const docSnap = await getDoc(docRef)

  try {
    if (!docSnap.exists()) {
      player.id = await getUserID()
      player.name = await getUserName()
      await setDoc(doc(db, 'players', player.id).withConverter(playerConverter), player)
    }
    setUserName(player.name)
  } catch (e) {
    console.error("Error adding document: ", e)
  }
}

export const updatePlayerGame = async (playerGame) => {
  const docRef = doc(db, 'playerGames', playerGame.id).withConverter(playerGameConverter)
  const docSnap = await getDoc(docRef)

  try {
    if (docSnap.exists()) {
      await updateDoc(docRef, playerGame)
    } else {
      await setDoc(docRef, playerGame)
    }
  } catch (e) {
    console.error("Error adding document: ", e)
  }
}

export const updatePlayerStats = async (playerStats, playerId) => {
  const docRef = doc(db, 'playerStats', playerId).withConverter(playerStatsConverter)
  const docSnap = await getDoc(docRef)

  try {
    if (docSnap.exists()) {
      const dbPlayerStats = docSnap.data()
      dbPlayerStats.games++
      return dbPlayerStats
    } else {
      await setDoc(docRef, playerStats)
    }
  } catch (e) {
    console.error("Error adding document: ", e)
  }
}
