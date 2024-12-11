import { useState, useEffect, useCallback } from "react"
import { useAuthentication } from "./useAuthentication"
import { getUserID, getUserName, setUserName, setUserID } from "./localStore" // Import setUserID
import { doc, getDoc, setDoc } from "firebase/firestore"
import { batchUpdatePlayerData } from "../firebaseService"
import { playerConverter } from "../firestore/converters/player"
import Player from "../../models/player"
import { db } from "../../config/firebase"
import { useAppContext } from "../../contexts/AppContext"

const usePlayerData = () => {
  const { user } = useAuthentication()
  const { state, dispatch } = useAppContext()
  const { player, playerGame, playerStats } = state
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

      // Always set a player, even if it's a guest
      dispatch({
        type: "SET_PLAYER",
        payload: { id, name },
      })

      // Initialize playerGame and playerStats with default values
      dispatch({
        type: "SET_PLAYER_GAME",
        payload: {
          ...playerGame,
          playerID: id,
          id: playerGame.id || Date.now().toString(), // Ensure playerGame has an ID
        },
      })
      dispatch({
        type: "SET_PLAYER_STATS",
        payload: { ...playerStats, id },
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while initializing player data."
      )
    } finally {
      setLoading(false)
    }
  }, [playerGame, playerStats, user, dispatch])

  useEffect(() => {
    initializePlayer()
  }, [initializePlayer])

  useEffect(() => {
    const updateStats = async () => {
      if (player.id) {
        setLoading(true)
        try {
          const result = await batchUpdatePlayerData(
            playerStats,
            playerGame,
            player.id
          )
          if (result.success) {
            console.log("Player stats updated.")
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "An unexpected error occurred while updating player stats."
          )
        } finally {
          setLoading(false)
        }
      }
    }
    if (playerStats) updateStats()
  }, [playerStats, player.id])

  useEffect(() => {
    console.log("usePlayerData useEffect [updateGame]: Dependencies -", {
      playerGame,
      playerId: player.id,
      playerStats,
    })

    const updateGame = async () => {
      if (player.id && playerGame.id && playerGame.guesses.length <= 5) {
        console.log("usePlayerData useEffect [updateGame]: Calling updateGame")
        setLoading(true)
        try {
          const result = await batchUpdatePlayerData(
            playerStats,
            playerGame,
            player.id
          )
          if (result.success) {
            console.log(
              "usePlayerData useEffect [updateGame]: Player game data updated."
            )
          }
        } catch (err) {
          console.error(
            "usePlayerData useEffect [updateGame]: Error updating game data:",
            err
          )
          setError(
            err instanceof Error
              ? err.message
              : "An unexpected error occurred while updating player game data."
          )
        } finally {
          setLoading(false)
        }
      } else {
        console.log(
          "usePlayerData useEffect [updateGame]: Skipping updateGame - conditions not met"
        )
      }
    }

    updateGame()
  }, [playerGame, player.id, playerStats])

  return { loading, error, initializePlayer }
}

export default usePlayerData
