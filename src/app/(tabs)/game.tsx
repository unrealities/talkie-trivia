import React, { useEffect, Suspense, lazy, useState } from "react"
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

  const [initialDataLoaded, setInitialDataLoaded] = useState(false)

  const updatePlayerGame = (newPlayerGame) => {
    console.log("GameScreen: Dispatching new playerGame:", newPlayerGame)
    dispatch({ type: "SET_PLAYER_GAME", payload: newPlayerGame })
  }
  const updatePlayerStats = (newPlayerStats) => {
    dispatch({ type: "SET_PLAYER_STATS", payload: newPlayerStats })
  }

  useEffect(() => {
    if (!movieDataLoading && playerDataLoaded) {
      setInitialDataLoaded(true)
    }
  }, [movieDataLoading, playerDataLoaded])

  if (isLoading || movieDataLoading || playerDataLoading) {
    console.log("GameScreen: Still loading...")
    return <LoadingIndicator />
  }

  if (dataLoadingError || movieDataError || playerDataError) {
    console.log("GameScreen: Data loading error:", dataLoadingError)
    const errorMessage =
      dataLoadingError || movieDataError || playerDataError || "Unknown error"
    return <ErrorMessage message={errorMessage} />
  }

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
          initialDataLoaded={initialDataLoaded}
        />
      </Suspense>
    </View>
  )
}

export default GameScreen
