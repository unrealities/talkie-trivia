import React, { lazy, Suspense } from "react"
import { View } from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { appStyles } from "../../styles/appStyles"

import { useGame } from "../../contexts/gameContext"

const GameUI = lazy(() => import("../../components/gameUI"))

const GameScreen = () => {
  const { loading, error } = useGame()

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <View style={appStyles.container}>
      <Suspense fallback={<LoadingIndicator />}>
        {loading ? <LoadingIndicator /> : <GameUI />}
      </Suspense>
    </View>
  )
}

export default GameScreen
