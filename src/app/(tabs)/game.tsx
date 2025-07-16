import React, { lazy, Suspense } from "react"
import { View } from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { appStyles } from "../../styles/appStyles"

import { useAuth } from "../../contexts/authContext"
import { useAssets } from "../../contexts/assetsContext"
import { GameplayProvider } from "../../contexts/gameplayContext"

const MoviesContainer = lazy(() => import("../../components/movie"))

const GameScreen = () => {
  const {
    basicMovies,
    loading: assetsLoading,
    error: assetsError,
  } = useAssets()
  const { player, loading: authLoading, error: authError } = useAuth()

  const isDataLoading = assetsLoading || authLoading
  const error = assetsError || authError

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <View style={appStyles.container}>
      <Suspense fallback={<LoadingIndicator />}>
        {isDataLoading ||
        !player ||
        !basicMovies ||
        basicMovies.length === 0 ? (
          <LoadingIndicator />
        ) : (
          <GameplayProvider>
            <MoviesContainer />
          </GameplayProvider>
        )}
      </Suspense>
    </View>
  )
}

export default GameScreen
