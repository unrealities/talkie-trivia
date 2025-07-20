import React, { lazy, Suspense } from "react"
import { View } from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { appStyles } from "../../styles/appStyles"

import { useAuth } from "../../contexts/authContext"
import { useAssets } from "../../contexts/assetsContext"
import { useGame } from "../../contexts/gameContext"

const GameUI = lazy(() => import("../../components/gameUI"))

const GameScreen = () => {
  const {
    basicMovies,
    loading: assetsLoading,
    error: assetsError,
  } = useAssets()
  const { player, loading: authLoading, error: authError } = useAuth()
  const { loading: gameLoading, error: gameError } = useGame()

  const isDataLoading = assetsLoading || authLoading || gameLoading
  const error = assetsError || authError || gameError

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
          <GameUI />
        )}
      </Suspense>
    </View>
  )
}

export default GameScreen
