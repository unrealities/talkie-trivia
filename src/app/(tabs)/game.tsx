import React, { lazy, Suspense } from "react"
import { View } from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { appStyles } from "../../styles/appStyles"

import { useNetwork } from "../../contexts/networkContext"
import { useAssets } from "../../contexts/assetsContext"
import { useAuth } from "../../contexts/authContext"
import { useGameData } from "../../contexts/gameDataContext"

const MoviesContainer = lazy(() => import("../../components/movie"))

const GameScreen = () => {
  const { isNetworkConnected } = useNetwork()
  const {
    basicMovies,
    loading: assetsLoading,
    error: assetsError,
  } = useAssets()
  const { player, loading: authLoading, error: authError } = useAuth()
  const {
    playerGame,
    playerStats,
    loading: gameDataLoading,
    error: gameDataError,
    updatePlayerGame,
    updatePlayerStats,
  } = useGameData()
  const isDataLoading = assetsLoading || authLoading || gameDataLoading
  const error = assetsError || authError || gameDataError

  if (error) {
    return <ErrorMessage message={error} />
  }
  return (
    <View style={appStyles.container}>
      <Suspense fallback={<LoadingIndicator />}>
        {player && basicMovies && basicMovies.length > 0 ? (
          <MoviesContainer
            isNetworkConnected={isNetworkConnected}
            movies={basicMovies}
            player={player}
            playerGame={playerGame}
            playerStats={playerStats}
            updatePlayerGame={updatePlayerGame}
            updatePlayerStats={updatePlayerStats}
            isDataLoading={isDataLoading}
          />
        ) : (
          <LoadingIndicator />
        )}
      </Suspense>
    </View>
  )
}

export default GameScreen
