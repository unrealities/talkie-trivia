import { useState, useEffect, useMemo } from "react"
import { getFirestore } from "firebase/firestore"
import { Movie, BasicMovie } from "../../models/movie"
import Player from "../../models/player"
import { PlayerGame } from "../../models/game"
import PlayerStats from "../../models/playerStats"
import {
  fetchOrCreatePlayerGame,
  fetchOrCreatePlayerStats,
} from "../firestore/playerDataServices"
import {
  defaultPlayerGame,
  defaultPlayerStats,
  generateDateId,
} from "../../models/default"
import popularMoviesData from "../../../data/popularMovies.json"
import basicMoviesData from "../../../data/basicMovies.json"
import { Difficulty } from "../../models/game"

export function useGameData(player: Player | null, difficulty: Difficulty) {
  const [movies, setMovies] = useState<readonly Movie[]>([])
  const [basicMovies, setBasicMovies] = useState<readonly BasicMovie[]>([])
  const [assetsLoading, setAssetsLoading] = useState(true)
  const [assetsError, setAssetsError] = useState<string | null>(null)

  const [initialPlayerGame, setInitialPlayerGame] =
    useState<PlayerGame>(defaultPlayerGame)
  const [initialPlayerStats, setInitialPlayerStats] =
    useState<PlayerStats>(defaultPlayerStats)
  const [gameDataLoading, setGameDataLoading] = useState(true)
  const [gameDataError, setGameDataError] = useState<string | null>(null)

  // Load static JSON assets
  useEffect(() => {
    try {
      setMovies(popularMoviesData as Movie[])
      setBasicMovies(basicMoviesData as BasicMovie[])
    } catch (e: any) {
      setAssetsError(e.message)
    } finally {
      setAssetsLoading(false)
    }
  }, [])

  const movieForToday = useMemo(() => {
    if (movies.length === 0) return null
    const today = new Date()
    const start = new Date(today.getFullYear(), 0, 0)
    const diff = (today as any) - (start as any)
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    return movies[dayOfYear % movies.length]
  }, [movies])

  // Fetch dynamic player data from Firestore
  useEffect(() => {
    if (assetsLoading || !player || !movieForToday) return

    const initializePlayerData = async () => {
      setGameDataLoading(true)
      setGameDataError(null)
      try {
        const db = getFirestore()
        const today = new Date()
        const dateId = generateDateId(today)
        const guessesMax = difficulty === "very hard" ? 3 : 5

        let [game, stats] = await Promise.all([
          fetchOrCreatePlayerGame(db, player.id, dateId, today, movieForToday),
          fetchOrCreatePlayerStats(db, player.id),
        ])

        game.guessesMax = guessesMax

        if (difficulty === "very easy") {
          game.hintsUsed = {
            actor: true,
            decade: true,
            director: true,
            genre: true,
          }
        }

        setInitialPlayerGame(game)
        setInitialPlayerStats(stats)
      } catch (e: any) {
        setGameDataError(`Failed to load game data: ${e.message}`)
      } finally {
        setGameDataLoading(false)
      }
    }

    initializePlayerData()
  }, [player, movieForToday, assetsLoading, difficulty])

  return {
    movies,
    basicMovies,
    initialPlayerGame,
    initialPlayerStats,
    loading: assetsLoading || gameDataLoading,
    error: assetsError || gameDataError,
  }
}
