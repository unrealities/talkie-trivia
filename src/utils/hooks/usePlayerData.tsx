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
      console.log("usePlayerData: Initializing player...")
      let id = await getUserID()
      console.log("usePlayerData: Fetched id from local store:", id)
      let name = await getUserName()
      console.log("usePlayerData: Fetched name from local store:", name)

      if (user) {
        console.log("usePlayerData: User is logged in, checking Firestore")
        // If user is logged in, check if Firestore document exists
        const playerDocRef = doc(db, "players", user.uid).withConverter(
          playerConverter
        )
        console.log("usePlayerData: Firestore player document ref created.")
        const playerDocSnap = await getDoc(playerDocRef)
        console.log(
          "usePlayerData: Fetched player document snapshot:",
          playerDocSnap.exists()
        )
        if (playerDocSnap.exists()) {
          console.log("usePlayerData: player document exists, fetching data")
          const fetchedPlayer = playerDocSnap.data()
          id = fetchedPlayer.id
          name = fetchedPlayer.name
          console.log("usePlayerData: Fetched player data from firestore:", {
            id,
            name,
          })
          console.log("usePlayerData: Setting UserID", id)
          await setUserID(id)
          // Only set the user name if it's different
          console.log(
            "usePlayerData: Checking if name needs to be updated from:",
            await getUserName()
          )
          if (name !== (await getUserName())) {
            console.log("usePlayerData: Updating UserName from Firestore", name)
            await setUserName(name)
            console.log("usePlayerData: updated username", await getUserName())
          }
        } else {
          // If no player document in Firestore and user is logged in, create a new player
          console.log(
            "usePlayerData: No player document found in firestore creating new player"
          )
          const newPlayer = new Player(user.uid, user.displayName || "Guest")
          console.log("usePlayerData: Creating new player:", newPlayer)
          await setDoc(playerDocRef, newPlayer)
          console.log("usePlayerData: New player created in Firestore.")
          id = newPlayer.id
          name = newPlayer.name
          console.log("usePlayerData: Setting UserID", id)
          await setUserID(id)
          // Only set the user name if it's different
          console.log(
            "usePlayerData: Checking if name needs to be updated from:",
            await getUserName()
          )
          if (name !== (await getUserName())) {
            console.log("usePlayerData: Updating UserName from Firestore", name)
            await setUserName(name)
            console.log("usePlayerData: updated username", await getUserName())
          }
        }
      }
      console.log("usePlayerData: Setting player state with data:", {
        id,
        name,
      })
      dispatch({
        type: "SET_PLAYER",
        payload: { id, name },
      })

      console.log(
        "usePlayerData: Checking if player game has been initialized with ID:",
        playerGame.id
      )
      if (!playerGame.id) {
        console.log(
          "usePlayerData: Player game not initialized setting default"
        )
        dispatch({
          type: "SET_PLAYER_GAME",
          payload: {
            ...defaultPlayerGame, // Use default values from AppContext
            playerID: id,
            id: Date.now().toString(),
          },
        })
      } else {
        console.log(
          "usePlayerData: Player game initialized using the existing value",
          playerGame.id
        )
        dispatch({
          type: "SET_PLAYER_GAME",
          payload: {
            ...playerGame,
            playerID: id,
          },
        })
      }

      console.log(
        "usePlayerData: Checking if player stats has been initialized with ID:",
        playerStats.id
      )
      // Initialize playerStats only if it's empty
      if (!playerStats.id) {
        console.log(
          "usePlayerData: Player stats are not initialized setting defaults",
          id
        )
        dispatch({
          type: "SET_PLAYER_STATS",
          payload: { ...defaultPlayerStats, id }, // Use default values from AppContext
        })
      } else {
        console.log(
          "usePlayerData: Player stats initialized, using existing value"
        )
      }
    } catch (err) {
      console.error("usePlayerData: Error initializing player data:", err)
      setError("usePlayerData: Error initializing player data.")
    } finally {
      console.log("usePlayerData: Initialization complete.")
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
