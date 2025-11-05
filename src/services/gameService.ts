import {
  doc,
  getDoc,
  setDoc,
  writeBatch,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore"
import { db } from "./firebaseClient"
import { playerConverter } from "../utils/firestore/converters/player"
import { playerGameConverter } from "../utils/firestore/converters/playerGame"
import { playerStatsConverter } from "../utils/firestore/converters/playerStats"
import { gameHistoryEntryConverter } from "../utils/firestore/converters/gameHistoryEntry"
import Player from "../models/player"
import PlayerStats from "../models/playerStats"
import { PlayerGame } from "../models/game"
import { TriviaItem } from "../models/trivia"
import { FIRESTORE_COLLECTIONS } from "../config/constants"
import { GameHistoryEntry } from "../models/gameHistory"
import { defaultPlayerGame } from "../models/default"
import { DEFAULT_DIFFICULTY } from "../config/difficulty"

export const gameService = {
  /**
   * Ensures a player document exists in Firestore. Called during the authentication flow.
   */
  ensurePlayerExists: async (
    playerId: string,
    playerName: string
  ): Promise<Player> => {
    const playerRef = doc(
      db,
      FIRESTORE_COLLECTIONS.PLAYERS,
      playerId
    ).withConverter(playerConverter)
    const playerSnap = await getDoc(playerRef)
    if (playerSnap.exists()) {
      return playerSnap.data()
    } else {
      const newPlayer = new Player(playerId, playerName)
      await setDoc(playerRef, newPlayer)
      return newPlayer
    }
  },

  /**
   * Fetches or creates the player's game state for a given day.
   */
  fetchOrCreatePlayerGame: async (
    playerId: string,
    dateId: string,
    dailyItem: TriviaItem,
    guessesMax: number
  ): Promise<PlayerGame> => {
    const playerGameRef = doc(
      db,
      FIRESTORE_COLLECTIONS.PLAYER_GAMES,
      `${playerId}-${dateId}`
    ).withConverter(playerGameConverter)
    const gameSnap = await getDoc(playerGameRef)

    if (gameSnap.exists()) {
      const existingGame = gameSnap.data()
      existingGame.guessesMax = guessesMax
      return existingGame
    } else {
      const newPlayerGame: PlayerGame = {
        ...defaultPlayerGame,
        id: `${playerId}-${dateId}`,
        playerID: playerId,
        triviaItem: dailyItem,
        startDate: new Date(),
        endDate: new Date(),
        guessesMax: guessesMax,
        difficulty: DEFAULT_DIFFICULTY,
        hintsUsed: {},
      }
      await setDoc(playerGameRef, newPlayerGame)
      return newPlayerGame
    }
  },

  /**
   * Fetches or creates the player's overall statistics.
   */
  fetchOrCreatePlayerStats: async (playerId: string): Promise<PlayerStats> => {
    const statsRef = doc(
      db,
      FIRESTORE_COLLECTIONS.PLAYER_STATS,
      playerId
    ).withConverter(playerStatsConverter)
    const statsSnap = await getDoc(statsRef)
    if (statsSnap.exists()) {
      return statsSnap.data()
    } else {
      const newPlayerStats: PlayerStats = {
        id: playerId,
        currentStreak: 0,
        games: 0,
        maxStreak: 0,
        wins: [0, 0, 0, 0, 0],
        hintsAvailable: 3,
        hintsUsedCount: 0,
        allTimeScore: 0,
      }
      await setDoc(statsRef, newPlayerStats)
      return newPlayerStats
    }
  },

  /**
   * Saves the player's game progress, stats, and optionally a history entry in a single transaction.
   */
  savePlayerProgress: async (
    playerGame: PlayerGame,
    playerStats: PlayerStats,
    gameHistoryEntry: GameHistoryEntry | null = null
  ) => {
    if (!playerGame.playerID) {
      throw new Error("Player ID is missing. Cannot save game progress.")
    }

    const batch = writeBatch(db)

    const statsDocRef = doc(
      db,
      FIRESTORE_COLLECTIONS.PLAYER_STATS,
      playerGame.playerID
    ).withConverter(playerStatsConverter)
    batch.set(statsDocRef, playerStats, { merge: true })

    const gameDocRef = doc(
      db,
      FIRESTORE_COLLECTIONS.PLAYER_GAMES,
      playerGame.id
    ).withConverter(playerGameConverter)
    batch.set(gameDocRef, playerGame, { merge: true })

    if (gameHistoryEntry) {
      const historyDocRef = doc(
        db,
        `${FIRESTORE_COLLECTIONS.PLAYERS}/${playerGame.playerID}/${FIRESTORE_COLLECTIONS.GAME_HISTORY}`,
        gameHistoryEntry.dateId
      ).withConverter(gameHistoryEntryConverter)
      batch.set(historyDocRef, gameHistoryEntry)
    }

    await batch.commit()
  },

  /**
   * Fetches the game history for a given player.
   */
  fetchGameHistory: async (playerId: string): Promise<GameHistoryEntry[]> => {
    const historyRef = collection(
      db,
      `${FIRESTORE_COLLECTIONS.PLAYERS}/${playerId}/${FIRESTORE_COLLECTIONS.GAME_HISTORY}`
    ).withConverter(gameHistoryEntryConverter)
    const q = query(historyRef, orderBy("dateId", "desc"), limit(20))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data())
  },
}
