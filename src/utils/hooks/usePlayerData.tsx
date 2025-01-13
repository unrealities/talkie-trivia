import { useState, useEffect, useCallback } from "react"
import { useAuthentication } from "./useAuthentication"
import { getUserID, getUserName, setUserName, setUserID } from "./localStore"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { playerConverter } from "../firestore/converters/player"
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
  overview: "", // Ensure overview is never undefined
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

const usePlayerData = () => {
  const { user, authError } = useAuthentication()
  const { state, dispatch } = useAppContext()
  const { player, playerGame, playerStats } = state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializePlayer = useCallback(async () => {
    setLoading(true)
    console.log("usePlayerData: initializePlayer called") // Added log
    try {
      console.log("usePlayerData: Initializing player...")
      let id = await getUserID()
      console.log("usePlayerData: Fetched id from local store:", id)
      let name = await getUserName()
      console.log("usePlayerData: Fetched name from local store:", name)
      console.log("usePlayerData: User object:", user)

      if (authError) {
        console.error("usePlayerData: Auth error: ", authError)
        setError(`usePlayerData: Auth error: ${authError}`)
        return
      }

      if (user) {
        console.log("usePlayerData: User is logged in, checking Firestore")
        const playerDocRef = doc(db, "players", user.uid).withConverter(
          playerConverter
        )
        console.log(
          "usePlayerData: Firestore player document ref created:",
          playerDocRef.path
        )
        const playerDocSnap = await getDoc(playerDocRef)
        console.log(
          "usePlayerData: Fetched player document snapshot. Exists?:",
          playerDocSnap.exists()
        )

        if (playerDocSnap.exists()) {
          console.log("usePlayerData: Player document exists, fetching data")
          const fetchedPlayer = playerDocSnap.data()
          console.log("usePlayerData: Fetched player:", fetchedPlayer)
          id = fetchedPlayer.id
          name = fetchedPlayer.name
          console.log("usePlayerData: Using fetched player data:", { id, name })

          console.log("usePlayerData: Setting UserID (fetched):", id)
          await setUserID(id)
          if (name !== (await getUserName())) {
            console.log("usePlayerData: Updating UserName (fetched):", name)
            await setUserName(name)
          }
        } else {
          console.log(
            "usePlayerData: No player document found in Firestore, creating new player"
          )
          const newPlayer = new Player(user.uid, user.displayName || "Guest")
          console.log("usePlayerData: New player instance:", newPlayer)
          await setDoc(playerDocRef, newPlayer)
          console.log("usePlayerData: New player created in Firestore")
          id = newPlayer.id
          name = newPlayer.name

          console.log("usePlayerData: Setting UserID (new):", id)
          await setUserID(id)
          if (name !== (await getUserName())) {
            console.log("usePlayerData: Updating UserName (new):", name)
            await setUserName(name)
          }
        }
      } else {
        console.log("usePlayerData: User is NOT logged in. Using local ID:", id)
      }

      console.log("usePlayerData: Dispatching SET_PLAYER with:", { id, name })
      dispatch({
        type: "SET_PLAYER",
        payload: { id, name },
      })

      console.log("usePlayerData: playerGame before dispatch:", playerGame)
      if (!playerGame.id) {
        console.log("usePlayerData: Initializing playerGame (new)")
        dispatch({
          type: "SET_PLAYER_GAME",
          payload: {
            ...defaultPlayerGame,
            playerID: id,
            id: Date.now().toString(),
          },
        })
      } else {
        console.log(
          "usePlayerData: Initializing playerGame (existing):",
          playerGame
        )
        dispatch({
          type: "SET_PLAYER_GAME",
          payload: {
            ...playerGame,
            playerID: id,
          },
        })
      }

      console.log("usePlayerData: playerStats before dispatch:", playerStats)
      if (!playerStats.id) {
        console.log("usePlayerData: Initializing playerStats (new)")
        dispatch({
          type: "SET_PLAYER_STATS",
          payload: { ...defaultPlayerStats, id },
        })
      } else {
        console.log("usePlayerData: Using existing playerStats")
      }
    } catch (err: any) {
      console.error("usePlayerData: Error initializing player:", err)
      setError(`usePlayerData: Error initializing player: ${err.message}`) // More specific error
    } finally {
      console.log("usePlayerData: Initialization complete.")
      setLoading(false)
    }
  }, [user, dispatch, playerGame, playerStats, authError])

  return { loading, error, initializePlayer }
}

export default usePlayerData
