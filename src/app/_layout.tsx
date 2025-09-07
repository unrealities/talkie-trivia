import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Slot } from "expo-router"
import { View } from "react-native"
import ErrorBoundary from "../components/errorBoundary"
import { NetworkProvider, useNetwork } from "../contexts/networkContext"
import { AuthProvider, useAuth } from "../contexts/authContext"
import { ThemeProvider, useTheme } from "../contexts/themeContext"
import LoadingIndicator from "../components/loadingIndicator"
import ErrorMessage from "../components/errorMessage"
import { getAppStyles } from "../styles/appStyles"
import { useGameStore } from "../state/gameStore"

function RootLayoutNav() {
  const { isNetworkConnected } = useNetwork()
  const { colors } = useTheme()
  const styles = useMemo(() => getAppStyles(colors), [colors])
  const [retryKey, setRetryKey] = useState(0)

  const { player } = useAuth()
  const initializeGame = useGameStore((state) => state.initializeGame)
  const loading = useGameStore((state) => state.loading)
  const error = useGameStore((state) => state.error)

  useEffect(() => {
    if (player && isNetworkConnected) {
      initializeGame(player)
    }
  }, [player, isNetworkConnected, retryKey])

  const handleRetry = useCallback(() => {
    setRetryKey((prevKey) => prevKey + 1)
  }, [])

  if (isNetworkConnected === null) {
    return <LoadingIndicator />
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

  if (loading) {
    return <LoadingIndicator />
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={handleRetry} />
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
