import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react"
import { getFirestore } from "firebase/firestore"
import { PlayerGame } from "../models/game"
import PlayerStats from "../models/playerStats"
import {
  defaultPlayerGame,
  defaultPlayerStats,
  generateDateId,
} from "../models/default"
import { useAuth } from "./authContext"
import { useAssets } from "./assetsContext"
import {
  fetchOrCreatePlayerGame,
  fetchOrCreatePlayerStats,
} from "../utils/firestore/playerDataServices"
import { batchUpdatePlayerData } from "../utils/firebaseService"

interface GameDataState {
  playerGame: PlayerGame
  playerStats: PlayerStats
  loading: boolean
  error: string | null
  updatePlayerGame: (newPlayerGame: PlayerGame) => void
  updatePlayerStats: (newPlayerStats: PlayerStats) => void
  saveGameData: () => Promise<void>
}

const GameDataContext = createContext<GameDataState | undefined>(undefined)

export const GameDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { player, loading: authLoading } = useAuth()
  const { movieForToday, loading: assetsLoading } = useAssets()

  const [playerGame, setPlayerGame] = useState<PlayerGame>(defaultPlayerGame)
  const [playerStats, setPlayerStats] =
    useState<PlayerStats>(defaultPlayerStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeData = async () => {
      if (authLoading || assetsLoading || !player || !movieForToday) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        if (__DEV__) {
          console.log("GameDataContext: Initializing player game data...")
        }
        const db = getFirestore()
        const today = new Date()
        const dateId = generateDateId(today)

        const [game, stats] = await Promise.all([
          fetchOrCreatePlayerGame(db, player.id, dateId, today, movieForToday),
          fetchOrCreatePlayerStats(db, player.id),
        ])

        setPlayerGame(game)
        setPlayerStats(stats)
        if (__DEV__) {
          console.log(
            "GameDataContext: Player game data initialized successfully."
          )
        }
      } catch (e: any) {
        console.error("GameDataContext: Error initializing data:", e)
        setError(`Failed to load game data: ${e.message}`)
      } finally {
        setLoading(false)
      }
    }
    initializeData()
  }, [player, movieForToday, authLoading, assetsLoading])

  const updatePlayerGame = useCallback((newPlayerGame: PlayerGame) => {
    setPlayerGame(newPlayerGame)
  }, [])

  const updatePlayerStats = useCallback((newPlayerStats: PlayerStats) => {
    setPlayerStats(newPlayerStats)
  }, [])

  const saveGameData = useCallback(async () => {
    if (!player) {
      console.error(
        "GameDataContext: Cannot save data, player is not available."
      )
      return
    }
    try {
      await batchUpdatePlayerData(playerStats, playerGame, player.id)
      if (__DEV__) {
        console.log("GameDataContext: Game data saved successfully.")
      }
    } catch (e: any) {
      console.error("GameDataContext: Failed to save game data", e)
      setError(`Failed to save progress: ${e.message}`)
    }
  }, [player, playerGame, playerStats])

  const value = {
    playerGame,
    playerStats,
    loading: loading || authLoading || assetsLoading,
    error,
    updatePlayerGame,
    updatePlayerStats,
    saveGameData,
  }

  return (
    <GameDataContext.Provider value={value}>
      {children}
    </GameDataContext.Provider>
  )
}

export const useGameData = () => {
  const context = useContext(GameDataContext)
  if (context === undefined) {
    throw new Error("useGameData must be used within a GameDataProvider")
  }
  return context
}
