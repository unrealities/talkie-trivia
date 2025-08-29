import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
  collection,
  query,
  orderBy,
  limit,
} from "firebase/firestore"
import { db } from "./firebaseClient"
import { playerConverter } from "../utils/firestore/converters/player"
import { playerGameConverter } from "../utils/firestore/converters/playerGame"
import { playerStatsConverter } from "../utils/firestore/converters/playerStats"
import { gameHistoryEntryConverter } from "../utils/firestore/converters/gameHistoryEntry"
import Player from "../models/player"
import PlayerStats from "../models/playerStats"
import { Difficulty, PlayerGame } from "../models/game"
import { Movie } from "../models/movie"
import {
  defaultPlayerGame,
  defaultPlayerStats,
  generateDateId,
} from "../models/default"
import { FIRESTORE_COLLECTIONS } from "../config/constants"
import { GameHistoryEntry } from "../models/gameHistory"

/**
 * Fetches the movie designated for today directly from Firestore.
 */
const _fetchMovieForToday = async (): Promise<Movie> => {
  const dateId = generateDateId(new Date())

  // 1. Find out which movie ID is scheduled for today.
  const dailyGameRef = doc(db, FIRESTORE_COLLECTIONS.DAILY_GAMES, dateId)
  const dailyGameSnap = await getDoc(dailyGameRef)

  if (!dailyGameSnap.exists()) {
    throw new Error(
      `No game scheduled for today (${dateId}). Please run the scheduling script.`
    )
  }

  const movieId = dailyGameSnap.data().movieId
  if (!movieId) {
    throw new Error(`Scheduled game for ${dateId} is missing a movieId.`)
  }

  // 2. Fetch the full details for that specific movie.
  const movieRef = doc(db, FIRESTORE_COLLECTIONS.MOVIES, movieId.toString())
  const movieSnap = await getDoc(movieRef)

  if (!movieSnap.exists()) {
    throw new Error(`Movie with ID ${movieId} not found in the database.`)
  }

  return movieSnap.data() as Movie
}

const _fetchOrCreatePlayer = async (
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
}

const _fetchOrCreatePlayerGame = async (
  playerId: string,
  dateId: string,
  today: Date,
  movieForToday: Movie,
  guessesMax: number
): Promise<PlayerGame> => {
  const playerGameRef = doc(
    db,
    FIRESTORE_COLLECTIONS.PLAYER_GAMES,
    `${playerId}-${dateId}`
  ).withConverter(playerGameConverter)
  const gameSnap = await getDoc(playerGameRef)

  if (gameSnap.exists()) {
    return gameSnap.data()
  } else {
    const newPlayerGame: PlayerGame = {
      ...defaultPlayerGame,
      id: `${playerId}-${dateId}`,
      playerID: playerId,
      movie: movieForToday,
      startDate: today,
      endDate: today,
      guessesMax,
    }
    await setDoc(playerGameRef, newPlayerGame)
    return newPlayerGame
  }
}

const _fetchOrCreatePlayerStats = async (
  playerId: string
): Promise<PlayerStats> => {
  const statsRef = doc(
    db,
    FIRESTORE_COLLECTIONS.PLAYER_STATS,
    playerId
  ).withConverter(playerStatsConverter)
  const statsSnap = await getDoc(statsRef)
  if (statsSnap.exists()) {
    return statsSnap.data()
  } else {
    const newPlayerStats = { ...defaultPlayerStats, id: playerId }
    await setDoc(statsRef, newPlayerStats)
    return newPlayerStats
  }
}

export const gameService = {
  getInitialGameData: async (player: Player, difficulty: Difficulty) => {
    // UPDATED: Fetch the single movie for today from the backend
    const movieForToday = await _fetchMovieForToday()

    // In a production app with millions of movies, you would not fetch them all.
    // But since your list is finite, fetching them all once for lookups is acceptable.
    const moviesCollectionRef = collection(db, FIRESTORE_COLLECTIONS.MOVIES)
    const moviesSnapshot = await getDocs(moviesCollectionRef)
    const allMovies = moviesSnapshot.docs.map((doc) => doc.data() as Movie)

    if (allMovies.length === 0) {
      throw new Error(
        "No movies found in the database. Please populate Firestore first."
      )
    }

    const today = new Date()
    const dateId = generateDateId(today)
    const guessesMax = difficulty === "very hard" ? 3 : 5

    const [game, stats] = await Promise.all([
      _fetchOrCreatePlayerGame(
        player.id,
        dateId,
        today,
        movieForToday,
        guessesMax
      ),
      _fetchOrCreatePlayerStats(player.id),
    ])

    game.guessesMax = guessesMax
    if (difficulty === "very easy") {
      game.hintsUsed = {
        actor: true,
        decade: true,
        director: true,
        genre: true,
      }
    }

    return {
      initialPlayerGame: game,
      initialPlayerStats: stats,
      allMovies,
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
   * Fetches a full movie object by its ID. Used for the history modal.
   */
  fetchMovieById: async (movieId: number): Promise<Movie | null> => {
    const movieDocRef = doc(
      db,
      FIRESTORE_COLLECTIONS.MOVIES,
      movieId.toString()
    )
    const movieSnap = await getDoc(movieDocRef)
    if (movieSnap.exists()) {
      return movieSnap.data() as Movie
    }
    return null
  },

  /**
   * Fetches a specific past player game session. Used for the history modal.
   */
  fetchPlayerGameById: async (gameId: string): Promise<PlayerGame | null> => {
    const gameDocRef = doc(
      db,
      FIRESTORE_COLLECTIONS.PLAYER_GAMES,
      gameId
    ).withConverter(playerGameConverter)
    const gameSnap = await getDoc(gameDocRef)
    if (gameSnap.exists()) {
      return gameSnap.data()
    }
    return null
  },

  /**
   * Ensures a player document exists in Firestore. Called during the authentication flow.
   */
  ensurePlayerExists: async (
    playerId: string,
    playerName: string
  ): Promise<Player> => {
    return _fetchOrCreatePlayer(playerId, playerName)
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
