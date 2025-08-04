import React, { lazy, Suspense, useMemo } from "react"
import { View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { getAppStyles } from "../../styles/appStyles"
import { useGame } from "../../contexts/gameContext"
import { useTheme } from "../../contexts/themeContext"

const GameUI = lazy(() => import("../../components/gameUI"))

const GameScreen = () => {
  const { loading, error } = useGame()
  const { colors } = useTheme()
  const styles = useMemo(() => getAppStyles(colors), [colors])

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundLight]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Suspense fallback={<LoadingIndicator />}>
          {loading ? <LoadingIndicator /> : <GameUI />}
        </Suspense>
      </View>
    </LinearGradient>
  )
}

export default GameScreen
