import { useState, useEffect, useCallback } from "react"
import { useAuthentication } from "./useAuthentication"
import { getUserID, getUserName, setUserName, setUserID } from "./localStore"
import {
  doc,
  getDoc,
  setDoc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore"
import { playerConverter } from "../firestore/converters/player"
import { playerGameConverter } from "../firestore/converters/playerGame"
import { playerStatsConverter } from "../firestore/converters/playerStats"
import Player from "../../models/player"
import {
  defaultPlayerGame,
  defaultPlayerStats,
  useAppContext,
} from "../../contexts/appContext"
import { Game, PlayerGame } from "../../models/game"
import { Movie } from "../../models/movie"

const defaultMovie: Movie = {
  actors: [],
  director: { id: 0, name: "", popularity: 0, profile_path: "" },
  genres: [],
  id: 0,
  imdb_id: 0,
  overview: "",
  poster_path: "",
  popularity: 0,
  release_date: "",
  tagline: "",
  title: "",
  vote_average: 0,
  vote_count: 0,
}

const defaultGame: Game = {
  date: new Date(),
  guessesMax: 5,
  id: "",
  movie: defaultMovie,
}

const generateDateId = (date: Date) => {
  return date.toISOString().slice(0, 10)
}

const usePlayerData = () => {
  const { user } = useAuthentication()
  const { state, dispatch } = useAppContext()
  const { player, playerGame } = state
  const [loading, setLoading] = useState(false)
  const [playerDataLoaded, setPlayerDataLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date()
  const dateId = generateDateId(today)

  const initializePlayer = useCallback(async () => {
    setLoading(true)
    dispatch({ type: "SET_IS_LOADING", payload: true })
    console.log("usePlayerData: initializePlayer called")

    try {
      console.log("usePlayerData: Initializing player...")
      let id = await getUserID()
      let name = await getUserName()
      const db = getFirestore()

      const fetchOrCreatePlayer = async (
        playerId: string,
        playerName: string
      ) => {
        const playerRef = doc(db, "players", playerId).withConverter(
          playerConverter
        )
        const playerSnap = await getDoc(playerRef)

        if (playerSnap.exists()) {
          return playerSnap.data()
        } else {
          const newPlayer = new Player(playerId, playerName)
          await setDoc(playerRef, newPlayer)
          return newPlayer
        }
      }

      const fetchOrCreatePlayerGame = async (playerId: string) => {
        const q = query(
          collection(db, "playerGames").withConverter(playerGameConverter),
          where("playerID", "==", playerId),
          where("game.date", "==", dateId)
        )
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          return querySnapshot.docs[0].data()
        } else {
          const newPlayerGame: PlayerGame = {
            ...defaultPlayerGame,
            playerID: playerId,
            id: `${playerId}-${dateId}`,
            game: { ...defaultGame, date: today, id: `${playerId}-${dateId}` },
            hintsUsed: {},
            gaveUp: false,
          }

          const playerGameRef = doc(
            db,
            "playerGames",
            newPlayerGame.id
          ).withConverter(playerGameConverter)
          await setDoc(playerGameRef, newPlayerGame)
          return newPlayerGame
        }
      }

      const fetchOrCreatePlayerStats = async (playerId: string) => {
        const statsRef = doc(db, "playerStats", playerId).withConverter(
          playerStatsConverter
        )
        const statsSnap = await getDoc(statsRef)

        if (statsSnap.exists()) {
          return statsSnap.data()
        } else {
          const newPlayerStats = {
            ...defaultPlayerStats,
            id: playerId,
            hintsAvailable: 3,
          }
          await setDoc(statsRef, newPlayerStats)
          return newPlayerStats
        }
      }

      const fetchData = async (playerId: string, playerName: string) => {
        const fetchedPlayer = await fetchOrCreatePlayer(playerId, playerName)
        await setUserID(fetchedPlayer.id)
        await setUserName(fetchedPlayer.name)

        const fetchedPlayerGame = await fetchOrCreatePlayerGame(playerId)
        const fetchedPlayerStats = await fetchOrCreatePlayerStats(playerId)

        return { fetchedPlayer, fetchedPlayerGame, fetchedPlayerStats }
      }

      if (user) {
        id = user.uid
        name = user.displayName || "Guest"
      }
      const { fetchedPlayer, fetchedPlayerGame, fetchedPlayerStats } =
        await fetchData(id, name)

      const todayMovieIndex = new Date().getDate() % state.movies.length
      const todayMovie = state.movies[todayMovieIndex]

      let finalPlayerGame = fetchedPlayerGame
      if (
        todayMovie &&
        todayMovie.id &&
        fetchedPlayerGame.game.movie.id !== todayMovie.id
      ) {
        finalPlayerGame = {
          ...defaultPlayerGame,
          playerID: fetchedPlayer.id,
          id: `${fetchedPlayer.id}-${dateId}`,
          game: {
            ...defaultGame,
            date: today,
            id: `${fetchedPlayer.id}-${dateId}`,
            movie: todayMovie,
          },
        }
      }

      dispatch({ type: "SET_PLAYER", payload: fetchedPlayer })
      dispatch({ type: "SET_PLAYER_GAME", payload: finalPlayerGame })
      dispatch({ type: "SET_PLAYER_STATS", payload: fetchedPlayerStats })
      dispatch({ type: "SET_HAS_GAME_STARTED", payload: true })
    } catch (err: any) {
      console.error("usePlayerData: Error initializing player:", err)
      setError(`usePlayerData: Error initializing player: ${err.message}`)
      dispatch({ type: "SET_DATA_LOADING_ERROR", payload: err.message })
    } finally {
      console.log("usePlayerData: Initialization complete.")
      setLoading(false)
      setPlayerDataLoaded(true)
      dispatch({ type: "SET_IS_LOADING", payload: false })
    }
  }, [dispatch, dateId, user, state.movies])

  useEffect(() => {
    console.log("usePlayerData useEffect: user changed:", user)
    initializePlayer()
  }, [user, initializePlayer])

  useEffect(() => {
    if (state.hasGameStarted && state.movies && state.movies.length > 0) {
      console.log("usePlayerData useEffect [movies]: Effect running")
    }
  }, [state.movies, state.hasGameStarted, dispatch, player.id])

  return { loading, error, playerDataLoaded, initializePlayer }
}

export default usePlayerData
