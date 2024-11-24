import { useState, useCallback, useEffect } from "react"
import * as Network from "expo-network"
import * as SplashScreen from "expo-splash-screen"
import uuid from "react-native-uuid"
import { Movie, BasicMovie } from "../models/movie"
import { Player } from "../models/player"
import { PlayerGame } from "../models/game"
import { PlayerStats } from "../models/playerStats"

const movies: Movie[] = require("../../data/popularMovies.json")
const basicMovies: BasicMovie[] = require("../../data/basicMovies.json")

interface UseAppStateProps {
  fontsLoaded: boolean
}

export const useAppState = ({ fontsLoaded }: UseAppStateProps) => {
  const [isAppReady, setIsAppReady] = useState(false)
  const [isNetworkConnected, setIsNetworkConnected] = useState(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  const [player, setPlayer] = useState<Player>({
    id: uuid.v4().toString(),
    name: "",
  })

  const [movie] = useState<Movie>(movies[new Date().getDate() % movies.length])

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

  const loadResources = useCallback(async () => {
    try {
      const networkState = await Network.getNetworkStateAsync()
      setIsNetworkConnected(networkState.isInternetReachable ?? false)

      if (fontsLoaded && networkState.isInternetReachable) {
        setIsAppReady(true)
        await SplashScreen.hideAsync()
      }
    } catch (error) {
      setLoadingError("Error loading resources. Please try again.")
      console.error("Error loading resources: ", error)
    }
  }, [fontsLoaded])

  const retryLoadResources = async () => {
    setLoadingError(null)
    await loadResources()
  }

  useEffect(() => {
    loadResources()
  }, [loadResources])

  return {
    isAppReady,
    isNetworkConnected,
    loadingError,
    player,
    playerGame,
    playerStats,
    setPlayerGame,
    setPlayerStats,
    retryLoadResources,
    basicMovies,
  }
}
