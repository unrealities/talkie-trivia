import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Firestore,
} from "firebase/firestore"
import { playerConverter } from "./converters/player"
import { playerGameConverter } from "./converters/playerGame"
import { playerStatsConverter } from "./converters/playerStats"
import Player from "../../models/player"
import PlayerStats from "../../models/playerStats"
import { PlayerGame } from "../../models/game"
import { Movie } from "../../models/movie"
import { defaultPlayerGame, defaultPlayerStats } from "../../models/default"

export const fetchOrCreatePlayer = async (
  db: Firestore,
  playerId: string,
  playerName: string
): Promise<Player> => {
  const playerRef = doc(db, "players", playerId).withConverter(playerConverter)
  const playerSnap = await getDoc(playerRef)
  if (playerSnap.exists()) {
    return playerSnap.data()
  } else {
    if (__DEV__) {
      console.log(`Creating new player: ${playerId}`)
    }
    const newPlayer = new Player(playerId, playerName)
    await setDoc(playerRef, newPlayer)
    return newPlayer
  }
}

export const fetchOrCreatePlayerGame = async (
  db: Firestore,
  playerId: string,
  dateId: string,
  today: Date,
  movieForToday: Movie
): Promise<PlayerGame> => {
  if (!movieForToday || !movieForToday.id) {
    throw new Error(
      "Invalid 'movieForToday' provided to fetchOrCreatePlayerGame."
    )
  }

  const playerGameRef = doc(
    db,
    "playerGames",
    `${playerId}-${dateId}`
  ).withConverter(playerGameConverter)
  const gameSnap = await getDoc(playerGameRef)

  if (gameSnap.exists()) {
    const existingGame = gameSnap.data()
    // If the movie for today has changed since the game was created, update it.
    if (existingGame.movie.id !== movieForToday.id) {
      if (__DEV__) {
        console.log(`Updating movie for existing game ${existingGame.id}`)
      }
      await updateDoc(playerGameRef, { movie: movieForToday })
      // Return the game data with the newly updated movie
      return { ...existingGame, movie: movieForToday }
    }
    return existingGame
  } else {
    if (__DEV__) {
      console.log(`Creating new playerGame for date: ${dateId}`)
    }
    const newPlayerGame: PlayerGame = {
      ...defaultPlayerGame,
      id: `${playerId}-${dateId}`,
      playerID: playerId,
      movie: movieForToday,
      startDate: today,
      endDate: today,
    }
    await setDoc(playerGameRef, newPlayerGame)
    return newPlayerGame
  }
}

export const fetchOrCreatePlayerStats = async (
  db: Firestore,
  playerId: string
): Promise<PlayerStats> => {
  const statsRef = doc(db, "playerStats", playerId).withConverter(
    playerStatsConverter
  )
  const statsSnap = await getDoc(statsRef)
  if (statsSnap.exists()) {
    return statsSnap.data()
  } else {
    if (__DEV__) {
      console.log(`Creating new playerStats for player: ${playerId}`)
    }
    const newPlayerStats = new PlayerStats(
      playerId,
      defaultPlayerStats.currentStreak,
      defaultPlayerStats.games,
      defaultPlayerStats.maxStreak,
      defaultPlayerStats.wins,
      defaultPlayerStats.hintsAvailable,
      defaultPlayerStats.hintsUsedCount
    )
    await setDoc(statsRef, { ...newPlayerStats })
    return newPlayerStats
  }
}
