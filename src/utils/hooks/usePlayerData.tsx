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

const generateDateId = (date) => {
  return date.toISOString().slice(0, 10)
}

const usePlayerData = () => {
  const { user, authError } = useAuthentication()
  const { state, dispatch } = useAppContext()
  const { player, playerGame, playerStats } = state
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
      console.log("usePlayerData: Fetched id from local store:", id)
      let name = await getUserName()
      console.log("usePlayerData: Fetched name from local store:", name)
      console.log("usePlayerData: User object:", user)
      let fetchedPlayerGame = defaultPlayerGame
      let fetchedPlayerStats = defaultPlayerStats

      const db = getFirestore()

      if (user) {
        console.log("usePlayerData: User is logged in, checking Firestore")
        const playerRef = doc(db, "players", user.uid).withConverter(
          playerConverter
        )
        const playerSnap = await getDoc(playerRef)

        if (playerSnap.exists()) {
          id = playerSnap.data().id
          name = playerSnap.data().name
          console.log("usePlayerData: Setting UserID (fetched):", id)
          await setUserID(id)
          if (name !== (await getUserName())) {
            console.log("usePlayerData: Updating UserName (fetched):", name)
            await setUserName(name)
          }
        } else {
          console.log(
            "usePlayerData: Player not found, creating new player document"
          )
          const newPlayer = new Player(user.uid, user.displayName || "Guest")
          await setDoc(playerRef, newPlayer)
          id = newPlayer.id
          name = newPlayer.name

          console.log("usePlayerData: Setting UserID (new):", id)
          await setUserID(id)
          if (name !== (await getUserName())) {
            console.log("usePlayerData: Updating UserName (new):", name)
            await setUserName(name)
          }
        }

        const q = query(
          collection(db, "playerGames").withConverter(playerGameConverter),
          where("playerID", "==", user.uid),
          where("game.date", "==", dateId)
        )
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          console.log(`Found existing game for today`)
          fetchedPlayerGame = querySnapshot.docs[0].data()
        } else {
          console.log(`Creating new game for today`)
          fetchedPlayerGame = {
            ...defaultPlayerGame,
            playerID: id,
            id: `${user.uid}-${dateId}`,
            game: { ...defaultGame, date: dateId, id: `${user.uid}-${dateId}` },
          }
          const playerGameRef = doc(
            db,
            "playerGames",
            fetchedPlayerGame.id
          ).withConverter(playerGameConverter)
          await setDoc(playerGameRef, fetchedPlayerGame)
        }

        const statsRef = doc(db, "playerStats", user.uid).withConverter(
          playerStatsConverter
        )
        const statsSnap = await getDoc(statsRef)

        if (statsSnap.exists()) {
          console.log("Found existing player stats")
          fetchedPlayerStats = statsSnap.data()
        } else {
          console.log("Creating new player stats")
          fetchedPlayerStats = { ...defaultPlayerStats, id }
          await setDoc(statsRef, fetchedPlayerStats)
        }
      } else {
        console.log("User is null")
        console.log("usePlayerData: User is NOT logged in. Using local ID:", id)

        const playerRef = doc(db, "players", id).withConverter(playerConverter)
        try {
          console.log("usePlayerData: Attempting to get player document:", id)
          const playerSnap = await getDoc(playerRef)
          console.log("usePlayerData: Player document snapshot:", playerSnap)

          if (!playerSnap.exists()) {
            console.log(
              "usePlayerData: Player document does not exist, creating..."
            )
            const newPlayer = new Player(id, name)
            await setDoc(playerRef, newPlayer)
            console.log(
              "usePlayerData: New player document created:",
              newPlayer
            )
          } else {
            console.log("usePlayerData: Player document exists")
          }
        } catch (error) {
          console.error(
            "usePlayerData: Error fetching or creating player document:",
            error
          )

          dispatch({
            type: "SET_DATA_LOADING_ERROR",
            payload: error.message,
          })
          return
        }

        const q = query(
          collection(db, "playerGames").withConverter(playerGameConverter),
          where("playerID", "==", id),
          where("game.date", "==", dateId)
        )

        try {
          console.log(
            "usePlayerData: Attempting to get playerGames for guest:",
            id,
            dateId
          )
          const querySnapshot = await getDocs(q)
          console.log(
            "usePlayerData: PlayerGames query snapshot:",
            querySnapshot
          )
          if (!querySnapshot.empty) {
            console.log(`Found existing game for today for guest user`)
            fetchedPlayerGame = querySnapshot.docs[0].data()
          } else {
            console.log(`Creating new game for today for guest user`)
            fetchedPlayerGame = {
              ...defaultPlayerGame,
              playerID: id,
              id: `${id}-${dateId}`,
              game: { ...defaultGame, date: dateId, id: `${id}-${dateId}` },
            }
            const playerGameRef = doc(
              db,
              "playerGames",
              fetchedPlayerGame.id
            ).withConverter(playerGameConverter)
            await setDoc(playerGameRef, fetchedPlayerGame)
            console.log(
              "usePlayerData: New playerGame document created:",
              fetchedPlayerGame
            )
          }
        } catch (error) {
          console.error(
            "usePlayerData: Error fetching or creating playerGames:",
            error
          )

          dispatch({
            type: "SET_DATA_LOADING_ERROR",
            payload: error.message,
          })
          return
        }

        const statsRef = doc(db, "playerStats", id).withConverter(
          playerStatsConverter
        )
        try {
          console.log(
            "usePlayerData: Attempting to get playerStats for guest:",
            id
          )
          const statsSnap = await getDoc(statsRef)
          console.log("usePlayerData: PlayerStats query snapshot:", statsSnap)

          if (statsSnap.exists()) {
            console.log("Found existing player stats for guest user")
            fetchedPlayerStats = statsSnap.data()
          } else {
            console.log("Creating new player stats for guest user")
            fetchedPlayerStats = { ...defaultPlayerStats, id }
            await setDoc(statsRef, fetchedPlayerStats)
            console.log(
              "usePlayerData: New playerStats document created:",
              fetchedPlayerStats
            )
          }
        } catch (error) {
          console.error(
            "usePlayerData: Error fetching or creating playerStats:",
            error
          )

          dispatch({
            type: "SET_DATA_LOADING_ERROR",
            payload: error.message,
          })
          return
        }
      }

      console.log("usePlayerData: Dispatching SET_PLAYER with:", { id, name })
      dispatch({
        type: "SET_PLAYER",
        payload: { id, name },
      })

      console.log(
        "usePlayerData: Dispatching SET_PLAYER_GAME with:",
        fetchedPlayerGame
      )
      dispatch({
        type: "SET_PLAYER_GAME",
        payload: fetchedPlayerGame,
      })

      console.log(
        "usePlayerData: Dispatching SET_PLAYER_STATS with:",
        fetchedPlayerStats
      )
      dispatch({
        type: "SET_PLAYER_STATS",
        payload: fetchedPlayerStats,
      })

      console.log("usePlayerData: Dispatching SET_HAS_GAME_STARTED with:", true)
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
  }, [user, dispatch])

  useEffect(() => {
    console.log("usePlayerData useEffect: user changed:", user)
    initializePlayer()
  }, [user, initializePlayer])

  useEffect(() => {
    if (state.hasGameStarted && state.movies && state.movies.length > 0) {
      console.log(
        "usePlayerData useEffect [movies]: resetting game due to new movies"
      )
      const todayMovieIndex = new Date().getDate() % state.movies.length
      const todayMovie = state.movies[todayMovieIndex]

      if (todayMovie && todayMovie.id && todayMovie.overview) {
        dispatch({
          type: "SET_PLAYER_GAME",
          payload: {
            ...defaultPlayerGame,
            playerID: player.id,
            id: `${player.id}-${dateId}`,
            game: {
              ...defaultGame,
              date: dateId,
              id: `${player.id}-${dateId}`,
              movie: todayMovie,
            },
          },
        })
      }
    }
  }, [state.movies, state.hasGameStarted, dispatch, dateId, player.id])

  return { loading, error, playerDataLoaded, initializePlayer }
}

export default usePlayerData
