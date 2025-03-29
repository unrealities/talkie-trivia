import React, { useEffect, Suspense, lazy, useState } from "react"
import { View, Text } from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { appStyles } from "../../styles/appStyles"
import { useAppContext } from "../../contexts/appContext"
import useNetworkStatus from "../../utils/hooks/useNetworkStatus"
import useMovieData from "../../utils/hooks/useMovieData"
import usePlayerData from "../../utils/hooks/usePlayerData"
import { useAuthentication } from "../../utils/hooks/useAuthentication"

const MoviesContainer = lazy(() => import("../../components/movie"))

const GameScreen = () => {
  const { state, dispatch } = useAppContext()
  const {
    isNetworkConnected,
    basicMovies,
    player,
    playerGame,
    playerStats,
    isLoading: isGlobalLoading,
    dataLoadingError,
  } = state

  const { loading: movieDataLoading, error: movieDataError } = useMovieData()
  const { error: playerDataError, playerDataLoaded } = usePlayerData()
  const { authLoading, authError } = useAuthentication()
  useNetworkStatus()

  const isLoading =
    isGlobalLoading || movieDataLoading || authLoading || !playerDataLoaded

  const updatePlayerGame = (newPlayerGame) => {
    console.log("GameScreen: Dispatching new playerGame:", newPlayerGame)
    dispatch({ type: "SET_PLAYER_GAME", payload: newPlayerGame })
  }
  const updatePlayerStats = (newPlayerStats) => {
    dispatch({ type: "SET_PLAYER_STATS", payload: newPlayerStats })
  }

  const combinedError =
    dataLoadingError || movieDataError || playerDataError || authError

  if (isLoading) {
    console.log(
      `GameScreen: Still loading... Global: ${isGlobalLoading}, Movie: ${movieDataLoading}, Auth: ${authLoading}, PlayerDataLoaded: ${playerDataLoaded}`
    )
    return <LoadingIndicator />
  }

  if (combinedError) {
    console.log("GameScreen: Data loading error:", combinedError)
    return <ErrorMessage message={combinedError} />
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
          initialDataLoaded={playerDataLoaded}
        />
      </Suspense>
    </View>
  )
}

export default GameScreen
