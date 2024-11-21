import { useState, useEffect, useMemo } from "react"
import uuid from "react-native-uuid"
import { Movie } from "../../models/movie"
import Player from "../../models/player"
import { PlayerGame } from "../../models/game"
import PlayerStats from "../../models/playerStats"
import { updatePlayerGame, updatePlayerStats } from "../firebaseService"

const getDailyMovie = (movies: Movie[]): Movie => {
  const today = new Date()
  const movieIndex = today.getDate() % movies.length
  return movies[movieIndex]
}

interface UseGameOptions {
  movies: Movie[]
  player: Player
}

export const useGameState = ({ movies, player }: UseGameOptions) => {
  const movie = useMemo(() => getDailyMovie(movies), [movies])

  const [playerGame, setPlayerGame] = useState<PlayerGame>({
    correctAnswer: false,
    endDate: new Date(),
    game: {
      date: new Date(),
      guessesMax: 5,
      id: uuid.v4().toString(),
      movie,
    },
    guesses: [],
    id: uuid.v4().toString(),
    playerID: player.id,
    startDate: new Date(),
  })

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    id: player.id,
    currentStreak: 0,
    games: 1,
    maxStreak: 0,
    wins: [0, 0, 0, 0, 0],
  })

  // Persistent update effects
  useEffect(() => {
    const updateStats = async () => {
      try {
        const updatedStats = await updatePlayerStats(playerStats, player.id)
        if (updatedStats.updated) {
          setPlayerStats(updatedStats.stats)
        }
      } catch (error) {
        console.error("Failed to update player stats:", error)
      }
    }
    updateStats()
  }, [playerStats, player.id])

  useEffect(() => {
    const updateGame = async () => {
      try {
        await updatePlayerGame(playerGame)
      } catch (error) {
        console.error("Failed to update player game:", error)
      }
    }
    updateGame()
  }, [playerGame])

  return {
    playerGame,
    setPlayerGame,
    playerStats,
    setPlayerStats,
  }
}
