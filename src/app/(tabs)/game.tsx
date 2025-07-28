import React, { lazy, Suspense } from "react"
import { View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { appStyles } from "../../styles/appStyles"
import { colors } from "../../styles/global"

import { useGame } from "../../contexts/gameContext"

const GameUI = lazy(() => import("../../components/gameUI"))

const GameScreen = () => {
  const { loading, error } = useGame()

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <LinearGradient colors={[colors.background, "#2C2C2C"]} style={{ flex: 1 }}>
      <View style={appStyles.container}>
        <Suspense fallback={<LoadingIndicator />}>
          {loading ? <LoadingIndicator /> : <GameUI />}
        </Suspense>
      </View>
    </LinearGradient>
  )
}

export default GameScreen
