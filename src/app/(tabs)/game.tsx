import React, { useEffect, Suspense, lazy } from "react"
import { View, Text } from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { appStyles } from "../../styles/appStyles"
import { useAppContext } from "../../contexts/appContext"
import useNetworkStatus from "../../utils/hooks/useNetworkStatus"
import useMovieData from "../../utils/hooks/useMovieData"
import usePlayerData from "../../utils/hooks/usePlayerData"

const MoviesContainer = lazy(() => import("../../components/movie"))

const GameScreen = () => {
  console.log("GameScreen: Simple log message")
  const { state, dispatch } = useAppContext()
  const {
    isNetworkConnected,
    basicMovies,
    player,
    playerGame,
    playerStats,
    isLoading,
    dataLoadingError,
  } = state

  const { loading: movieDataLoading, error: movieDataError } = useMovieData()
  const {
    loading: playerDataLoading,
    error: playerDataError,
    playerDataLoaded,
  } = usePlayerData()
  useNetworkStatus()

  const updatePlayerGame = (newPlayerGame) => {
    console.log("GameScreen: Dispatching new playerGame:", newPlayerGame)
    dispatch({ type: "SET_PLAYER_GAME", payload: newPlayerGame })
  }
  const updatePlayerStats = (newPlayerStats) => {
    dispatch({ type: "SET_PLAYER_STATS", payload: newPlayerStats })
  }

  if (isLoading || movieDataLoading || playerDataLoading || !playerDataLoaded) {
    console.log("GameScreen: Still loading...")
    return <LoadingIndicator />
  }

  if (!playerDataLoaded) {
    console.log("GameScreen: Waiting for playerData to load...")
    return <LoadingIndicator />
  }

  if (dataLoadingError || movieDataError || playerDataError) {
    console.log("GameScreen: Data loading error:", dataLoadingError)
    const errorMessage =
      dataLoadingError || movieDataError || playerDataError || "Unknown error"
    return <ErrorMessage message={errorMessage} />
  }

  console.log("GameScreen: basicMovies.length:", basicMovies.length)
  console.log("GameScreen: playerGame.game.movie:", playerGame.game.movie)

  if (basicMovies.length > 0 && playerGame.game.movie) {
    console.log("GameScreen: Rendering MoviesContainer")
    return (
      <View style={appStyles.container}>
        <Suspense fallback={<LoadingIndicator />}>
          <MoviesContainer
            isNetworkConnected={isNetworkConnected}
            movies={basicMovies}
            player={player}
            playerGame={playerGame}
            playerStats={playerStats}
            updatePlayerGame={updatePlayerGame}
            updatePlayerStats={updatePlayerStats}
          />
        </Suspense>
      </View>
    )
  } else {
    console.log("GameScreen: Still waiting for game data...")
    return <Text>Loading game data...</Text>
  }
}

export default GameScreen
