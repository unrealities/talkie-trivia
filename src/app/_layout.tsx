import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Slot } from "expo-router"
import { View, LogBox } from "react-native"
import ErrorBoundary from "../components/errorBoundary"
import { NetworkProvider, useNetwork } from "../contexts/networkContext"
import { AuthProvider, useAuth } from "../contexts/authContext"
import { ThemeProvider, useTheme } from "../contexts/themeContext"
import LoadingIndicator from "../components/loadingIndicator"
import ErrorMessage from "../components/errorMessage"
import { getAppStyles } from "../styles/appStyles"
import { useGameStore } from "../state/gameStore"

LogBox.ignoreLogs([
  "Warning: VictoryPie",
  "Warning: Slice",
  "Warning: VictoryLabel",
])

function RootLayoutNav() {
  const { isNetworkConnected } = useNetwork()
  const { colors } = useTheme()
  const styles = useMemo(() => getAppStyles(colors), [colors])
  const [retryKey, setRetryKey] = useState(0)

  const { player, loading: authLoading, error: authError } = useAuth()

  const initializeGame = useGameStore((state) => state.initializeGame)
  const gameLoading = useGameStore((state) => state.loading)
  const gameError = useGameStore((state) => state.error)

  useEffect(() => {
    if (player && isNetworkConnected && !authError) {
      initializeGame(player)
    }
  }, [player, isNetworkConnected, retryKey, authError])

  const handleRetry = useCallback(() => {
    setRetryKey((prevKey) => prevKey + 1)
  }, [])

  if (isNetworkConnected === null) {
    return <LoadingIndicator message="Checking network connection..." />
  }

  if (!isNetworkConnected) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          message="No Network Connection. Please check your internet and try again."
          onRetry={handleRetry}
        />
      </View>
    )
  }

  if (authLoading) {
    return <LoadingIndicator message="Authenticating user session..." />
  }

  if (gameLoading) {
    return <LoadingIndicator message="Loading daily movie and user data..." />
  }

  if (authError) {
    let displayMessage = `Critical Setup Error: ${authError}. Please try restarting the app.`

    if (authError.includes("Missing or insufficient permissions")) {
      displayMessage =
        "Critical Error: Cannot access user data (Firebase permissions failure). This usually indicates an issue with your account setup or backend configuration. Please restart the app or contact support."
    }

    return (
      <View style={styles.container}>
        <ErrorMessage message={displayMessage} onRetry={handleRetry} />
      </View>
    )
  }

  if (gameError) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={gameError} onRetry={handleRetry} />
      </View>
    )
  }

  return <Slot key={retryKey} />
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NetworkProvider>
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </NetworkProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
