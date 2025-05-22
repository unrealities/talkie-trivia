import { useState, useEffect, useCallback, useRef } from "react"
import { getFirestore } from "firebase/firestore"
import { useAuthentication } from "./useAuthentication"
import { getUserID, getUserName, setUserName, setUserID } from "./localStore"
import { useAppContext } from "../../contexts/appContext"
import { generateDateId } from "../../models/default"
import {
  fetchOrCreatePlayer,
  fetchOrCreatePlayerGame,
  fetchOrCreatePlayerStats,
} from "../../utils/firestore/playerDataServices"

const usePlayerData = () => {
  const { user, authLoading } = useAuthentication()
  const { state, dispatch } = useAppContext()
  const { movies } = state

  const [playerDataLoaded, setPlayerDataLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isInitializing = useRef(false)

  const today = new Date()
  const dateId = generateDateId(today)

  const initializePlayerData = useCallback(async () => {
    // Only proceed with initialization if authentication is complete, movies are loaded,
    // we are not already initializing, AND a user is authenticated.
    if (authLoading || !movies || movies.length === 0 || isInitializing.current || !user) {
      // ... existing log and dispatch for loading state ...
    ) {
      console.log(
        `usePlayerData: Delaying/Skipping init. AuthLoading: ${authLoading}, Movies loaded: ${
          !!movies && movies.length > 0
        }, Initializing: ${isInitializing.current}`
      )
      if (authLoading || !movies || movies.length === 0) {
        dispatch({ type: "SET_IS_LOADING", payload: true })
      }
      return
    }

    isInitializing.current = true
    setError(null)
    dispatch({ type: "SET_IS_LOADING", payload: true })

    console.log("usePlayerData: initializePlayerData called - Proceeding...")

    try {
      const db = getFirestore()

      // Since we now check for 'user' at the beginning, we can directly use user.uid and user.displayName
      const playerId = user.uid
      const playerName = user.displayName || "Guest"
      }

      const currentPlayer = await fetchOrCreatePlayer(db, playerId, playerName)
      await setUserID(currentPlayer.id)
      await setUserName(currentPlayer.name)

      const todayMovieIndex = today.getDate() % movies.length
      const movieForToday = movies[todayMovieIndex]
      if (!movieForToday || !movieForToday.id) {
        throw new Error("Could not determine movie for today.")
      }

      const currentGame = await fetchOrCreatePlayerGame(
        db,
        currentPlayer.id,
        dateId,
        today,
        movieForToday
      )
      const currentStats = await fetchOrCreatePlayerStats(db, currentPlayer.id)

      console.log("usePlayerData: Dispatching player data to context")
      dispatch({ type: "SET_PLAYER", payload: currentPlayer })
      dispatch({ type: "SET_PLAYER_GAME", payload: currentGame })
      dispatch({ type: "SET_PLAYER_STATS", payload: currentStats })
      dispatch({ type: "SET_HAS_GAME_STARTED", payload: true })

      setPlayerDataLoaded(true)
    } catch (err: any) {
      console.error("usePlayerData: Error initializing player data:", err)
      setError(`Failed to load player data: ${err.message}`)
      dispatch({ type: "SET_DATA_LOADING_ERROR", payload: err.message })
      setPlayerDataLoaded(false)
    } finally {
      console.log("usePlayerData: Initialization attempt finished.")
      isInitializing.current = false
      dispatch({ type: "SET_IS_LOADING", payload: false })
    }
  }, [user, authLoading, movies, dispatch, dateId, today])

  useEffect(() => {
    console.log(
      "usePlayerData useEffect Trigger: User or Movies changed, resetting loaded flag."
    )

    setPlayerDataLoaded(false)
  }, [user, movies])

  useEffect(() => {
    if (!playerDataLoaded && !authLoading && movies && movies.length > 0) {
      initializePlayerData()
    }
  }, [playerDataLoaded, authLoading, movies, initializePlayerData])

  return { error, playerDataLoaded }
}

export default usePlayerData
