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
} from "../../contexts/AppContext"
import { Game, PlayerGame } from "../../models/game"
import { Movie } from "../../models/movie"

// Define a default movie object to use as a placeholder
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
  const { user } = useAuthentication()
  const { state, dispatch } = useAppContext()
  const { player, playerGame, playerStats } = state // Destructure from state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializePlayer = useCallback(async () => {
    setLoading(true)
    try {
      let id = await getUserID()
      let name = await getUserName()

      if (user) {
        // If user is logged in, check if Firestore document exists
        const playerDocRef = doc(db, "players", user.uid).withConverter(
          playerConverter
        )
        const playerDocSnap = await getDoc(playerDocRef)

        if (playerDocSnap.exists()) {
          const fetchedPlayer = playerDocSnap.data()
          id = fetchedPlayer.id
          name = fetchedPlayer.name
          await setUserID(id)
          // Only set the user name if it's different
          if (name !== (await getUserName())) {
            await setUserName(name)
          }
        } else {
          // If no player document in Firestore and user is logged in, create a new player
          const newPlayer = new Player(user.uid, user.displayName || "Guest")
          await setDoc(playerDocRef, newPlayer)
          console.log("New player created in Firestore.")
          id = newPlayer.id
          name = newPlayer.name
          await setUserID(id)
          // Only set the user name if it's different
          if (name !== (await getUserName())) {
            await setUserName(name)
          }
        }
      }

      dispatch({
        type: "SET_PLAYER",
        payload: { id, name },
      })

      if (!playerGame.id) {
        dispatch({
          type: "SET_PLAYER_GAME",
          payload: {
            ...defaultPlayerGame, // Use default values from AppContext
            playerID: id,
            id: Date.now().toString(),
          },
        })
      } else {
        dispatch({
          type: "SET_PLAYER_GAME",
          payload: {
            ...playerGame,
            playerID: id,
          },
        })
      }

      // Initialize playerStats only if it's empty
      if (!playerStats.id) {
        dispatch({
          type: "SET_PLAYER_STATS",
          payload: { ...defaultPlayerStats, id }, // Use default values from AppContext
        })
      }
    } catch (err) {
      // ... (error handling)
    } finally {
      setLoading(false)
    }
  }, [
    user,
    dispatch,
    playerGame,
    playerStats,
    defaultPlayerGame,
    defaultPlayerStats,
  ]) // Include defaultPlayerGame and defaultPlayerStats in dependency array

  return { loading, error, initializePlayer }
}

export default usePlayerData
