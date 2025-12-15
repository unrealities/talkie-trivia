import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"
import { db, app } from "./firebaseClient"
import Constants from "expo-constants"
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

  fetchPlayerGameById: async (
    playerGameId: string
  ): Promise<PlayerGame | null> => {
    // --- E2E MOCK ---
    const isE2E =
      Constants.expoConfig?.extra?.isE2E === true ||
      process.env.EXPO_PUBLIC_IS_E2E === "true"

    if (isE2E) {
      return {
        ...defaultPlayerGame,
        id: playerGameId,
        triviaItem: {
          id: 27205, // Inception ID
          title: "Inception",
          description: "A thief who steals corporate secrets...",
          posterPath: "/9gk7admal4zlDun9ncJ7sUCKRnl.jpg",
          releaseDate: "2010-07-16",
          metadata: { imdb_id: "tt1375666" },
          hints: [],
        },
        guesses: [
          { itemId: 27205, hintInfo: [] }, // Winning guess
        ],
        correctAnswer: true,
        guessesMax: 5,
        difficulty: "LEVEL_4",
      }
    }

    const playerGameRef = doc(
      db,
      FIRESTORE_COLLECTIONS.PLAYER_GAMES,
      playerGameId
    ).withConverter(playerGameConverter)
    const gameSnap = await getDoc(playerGameRef)
    return gameSnap.exists() ? gameSnap.data() : null
  },

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
   * Securely submits the game result to Firebase Cloud Functions.
   * Server calculates score, updates stats, and verifies integrity.
   */
  submitGameResult: async (playerGame: PlayerGame): Promise<void> => {
    // --- CHECK FOR E2E MODE ---
    const isE2E =
      Constants.expoConfig?.extra?.isE2E === true ||
      process.env.EXPO_PUBLIC_IS_E2E === "true"

    if (isE2E) {
      console.log("[E2E] Intercepting submitGameResult. Simulating success.")
      return
    }

    const functions = getFunctions(app)
    const submitFunction = httpsCallable(functions, "submitGameResult")

    // Serialize dates to ISO strings for transport
    const payload = {
      ...playerGame,
      startDate:
        playerGame.startDate instanceof Date
          ? playerGame.startDate.toISOString()
          : playerGame.startDate,
      endDate:
        playerGame.endDate instanceof Date
          ? playerGame.endDate.toISOString()
          : playerGame.endDate,
    }

    await submitFunction({ playerGame: payload })
  },

  /**
   * @deprecated Used for local optimistic updates only if needed.
   * Direct writes are now blocked by security rules for stats/history.
   */
  savePlayerProgress: async (
    playerGame: PlayerGame,
    playerStats: PlayerStats,
    gameHistoryEntry: GameHistoryEntry | null = null
  ) => {
    throw new Error("Client-side save is deprecated. Use submitGameResult.")
  },

  fetchGameHistory: async (playerId: string): Promise<GameHistoryEntry[]> => {
    // --- E2E MOCK ---
    const isE2E =
      Constants.expoConfig?.extra?.isE2E === true ||
      process.env.EXPO_PUBLIC_IS_E2E === "true"

    if (isE2E) {
      // Return a fake history entry matching the E2E flow (Inception)
      return [
        {
          dateId: new Date().toISOString().split("T")[0],
          itemId: 27205, // Inception's real TMDB ID
          itemTitle: "Inception",
          posterPath: "/9gk7admal4zlDun9ncJ7sUCKRnl.jpg",
          wasCorrect: true,
          gaveUp: false,
          guessCount: 1,
          guessesMax: 5,
          difficulty: "LEVEL_4", // Hard mode from test
          score: 850,
          gameMode: "movies",
        },
      ]
    }

    const historyRef = collection(
      db,
      `${FIRESTORE_COLLECTIONS.PLAYERS}/${playerId}/${FIRESTORE_COLLECTIONS.GAME_HISTORY}`
    ).withConverter(gameHistoryEntryConverter)
    const q = query(historyRef, orderBy("dateId", "desc"), limit(20))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data())
  },
}
