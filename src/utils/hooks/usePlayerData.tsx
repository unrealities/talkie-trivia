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
import { playerStatsConverter } from "../firestore/converters/playerStats"
import Player from "../../models/player"
import { db } from "../../config/firebase"
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

      if (authError) {
        console.error("usePlayerData: Auth error: ", authError)
        setError(`usePlayerData: Auth error: ${authError}`)
        dispatch({ type: "SET_DATA_LOADING_ERROR", payload: authError })

        return
      }

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
          // Player doesn't exist in Firestore, create new player document
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
        //Get PlayerGames
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
        //Get Player Stats
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
        console.log("usePlayerData: User is NOT logged in. Using local ID:", id)
      }

      dispatch({
        type: "SET_PLAYER",
        payload: { id, name },
      })

      dispatch({
        type: "SET_PLAYER_GAME",
        payload: fetchedPlayerGame,
      })

      dispatch({
        type: "SET_PLAYER_STATS",
        payload: fetchedPlayerStats,
      })
    } catch (err: any) {
      console.error("usePlayerData: Error initializing player:", err)
      setError(`usePlayerData: Error initializing player: ${err.message}`)
      dispatch({ type: "SET_DATA_LOADING_ERROR", payload: err.message })
    } finally {
      console.log("usePlayerData: Initialization complete.")
      setLoading(false)
      dispatch({ type: "SET_IS_LOADING", payload: false })
    }
  }, [user, dispatch, authError, dateId])

  useEffect(() => {
    console.log("usePlayerData useEffect: user changed:", user)
    if (user) {
      console.log("usePlayer useEffect: calling initializePlayer")
      initializePlayer()
    }
  }, [user, initializePlayer])

  return { loading, error, initializePlayer }
}

export default usePlayerData
