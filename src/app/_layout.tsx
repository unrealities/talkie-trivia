import React, { useState, useCallback } from "react"
import { Slot } from "expo-router"
import { View } from "react-native"
import ErrorBoundary from "../components/errorBoundary"
import { NetworkProvider, useNetwork } from "../contexts/networkContext"
import { AssetsProvider } from "../contexts/assetsContext"
import { AuthProvider } from "../contexts/authContext"
import { GameDataProvider } from "../contexts/gameDataContext"
import LoadingIndicator from "../components/loadingIndicator"
import ErrorMessage from "../components/errorMessage"
import { appStyles } from "../styles/appStyles"

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <AssetsProvider>
    <AuthProvider>
      <GameDataProvider>{children}</GameDataProvider>
    </AuthProvider>
  </AssetsProvider>
)

const AppInitializer = () => {
  const { isNetworkConnected } = useNetwork()
  const [retryKey, setRetryKey] = useState(0)

  const handleRetry = useCallback(() => {
    // Incrementing the key will force a re-mount of AppProviders
    setRetryKey((prevKey) => prevKey + 1)
  }, [])

  // While the initial network state is being determined, show a loader.
  if (isNetworkConnected === null) {
    return <LoadingIndicator />
  }

  // If the initial check finds we are offline, show a retry screen.
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

  // If online, render the app providers. The key ensures a full reset on retry.
  return <AppProviders key={retryKey}>{<Slot />}</AppProviders>
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <NetworkProvider>
        <AppInitializer />
      </NetworkProvider>
    </ErrorBoundary>
  )
}
