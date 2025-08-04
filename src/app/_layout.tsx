import React, { useCallback, useMemo, useState } from "react"
import { Slot } from "expo-router"
import { View } from "react-native"
import ErrorBoundary from "../components/errorBoundary"
import { NetworkProvider, useNetwork } from "../contexts/networkContext"
import { AuthProvider } from "../contexts/authContext"
import { GameProvider } from "../contexts/gameContext"
import { ThemeProvider, useTheme } from "../contexts/themeContext"
import LoadingIndicator from "../components/loadingIndicator"
import ErrorMessage from "../components/errorMessage"
import { getAppStyles } from "../styles/appStyles"

function RootLayoutNav() {
  const { isNetworkConnected } = useNetwork()
  const { colors } = useTheme()
  const styles = useMemo(() => getAppStyles(colors), [colors])
  const [retryKey, setRetryKey] = useState(0)

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

  return <Slot key={retryKey} />
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NetworkProvider>
          <AuthProvider>
            <GameProvider>
              <RootLayoutNav />
            </GameProvider>
          </AuthProvider>
        </NetworkProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
