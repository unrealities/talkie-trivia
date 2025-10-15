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
import { Movie } from "../models/movie"
import {
  defaultPlayerGame,
  defaultPlayerStats,
  generateDateId,
} from "../models/default"
import { FIRESTORE_COLLECTIONS } from "../config/constants"
import { GameHistoryEntry } from "../models/gameHistory"
import popularMoviesData from "../../data/popularMovies.json"
import {
  DifficultyLevel,
  DIFFICULTY_MODES,
  DEFAULT_DIFFICULTY,
} from "../config/difficulty"

/**
 * Selects the movie for today from a local data file.
 * The selection is deterministic based on the day of the year.
 */
const _getMovieForToday = (): Movie => {
  const allMovies = popularMoviesData as Movie[]

  if (!allMovies || allMovies.length === 0) {
    throw new Error(
      "Local movie data (popularMovies.json) is missing or empty. Please run the data pipeline script."
    )
  }

  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 0)
  const diff = today.getTime() - startOfYear.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)

  const movieIndex = dayOfYear % allMovies.length
  const selectedMovie = allMovies[movieIndex]

  return selectedMovie
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
    const existingGame = gameSnap.data()
    existingGame.guessesMax = guessesMax
    return existingGame
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
  getInitialGameData: async (player: Player, difficulty: DifficultyLevel) => {
    // Select the movie for today from local data
    const movieForToday = _getMovieForToday()

    // Use the imported local movie data instead of fetching from Firestore
    const allMovies = popularMoviesData as Movie[]

    if (allMovies.length === 0) {
      throw new Error(
        "No movies found in local data. Please populate Firestore first."
      )
    }

    const today = new Date()
    const dateId = generateDateId(today)

    let difficultyMode = DIFFICULTY_MODES[difficulty]

    if (!difficultyMode) {
      console.error(
        `Invalid difficulty key: ${difficulty}. Falling back to default: ${DEFAULT_DIFFICULTY}.`
      )
      difficultyMode = DIFFICULTY_MODES[DEFAULT_DIFFICULTY]
    }

    const guessesMax = difficultyMode.guessesMax

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

    if (difficultyMode.hintStrategy === "ALL_REVEALED") {
      game.hintsUsed = {
        actor: true,
        decade: true,
        director: true,
        genre: true,
      }
    } else {
      game.hintsUsed = game.hintsUsed || {}
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
