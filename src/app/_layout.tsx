import React, { useState, useCallback } from "react"
import { Slot } from "expo-router"
import { View } from "react-native"
import ErrorBoundary from "../components/errorBoundary"
import { NetworkProvider, useNetwork } from "../contexts/networkContext"
import { AuthProvider } from "../contexts/authContext"
import { GameProvider } from "../contexts/gameContext"
import LoadingIndicator from "../components/loadingIndicator"
import ErrorMessage from "../components/errorMessage"
import { appStyles } from "../styles/appStyles"

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <GameProvider>{children}</GameProvider>
  </AuthProvider>
)

const AppInitializer = () => {
  const { isNetworkConnected } = useNetwork()
  const [retryKey, setRetryKey] = useState(0)

  const handleRetry = useCallback(() => {
    setRetryKey((prevKey) => prevKey + 1)
  }, [])

  if (isNetworkConnected === null) {
    return <LoadingIndicator />
  }

  if (!isNetworkConnected) {
    return (
      <View style={appStyles.container}>
        <ErrorMessage
          message="No Network Connection. Please check your internet and try again."
          onRetry={handleRetry}
        />
      </View>
    )
  }

  return (
    <NetworkProvider>
      <AppProviders key={retryKey}>{<Slot />}</AppProviders>
    </NetworkProvider>
  )
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppInitializer />
    </ErrorBoundary>
  )
}
