import { useState, useEffect } from "react"
import { Movie, BasicMovie } from "../../models/movie"
import Player from "../../models/player"
import { PlayerGame, Difficulty } from "../../models/game"
import PlayerStats from "../../models/playerStats"
import { defaultPlayerGame, defaultPlayerStats } from "../../models/default"
import { gameService } from "../../services/gameService"

export function useGameData(player: Player | null, difficulty: Difficulty) {
  const [movies, setMovies] = useState<readonly Movie[]>([])
  const [basicMovies, setBasicMovies] = useState<readonly BasicMovie[]>([])
  const [initialPlayerGame, setInitialPlayerGame] =
    useState<PlayerGame>(defaultPlayerGame)
  const [initialPlayerStats, setInitialPlayerStats] =
    useState<PlayerStats>(defaultPlayerStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!player) {
      return
    }

    const initializeGame = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await gameService.getInitialGameData(player, difficulty)
        setMovies(data.allMovies)
        setBasicMovies(data.basicMovies)
        setInitialPlayerGame(data.initialPlayerGame)
        setInitialPlayerStats(data.initialPlayerStats)
      } catch (e: any) {
        console.error("useGameData: Failed to initialize game data:", e)
        setError(`Failed to load game data: ${e.message}`)
      } finally {
        setLoading(false)
      }
    }

    initializeGame()
  }, [player, difficulty])

  return {
    movies,
    basicMovies,
    initialPlayerGame,
    initialPlayerStats,
    loading,
    error,
  }
}
