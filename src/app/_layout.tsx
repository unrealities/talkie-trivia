import React, { useCallback, useEffect, useState } from "react"
import { Slot } from "expo-router"
import { View, LogBox, ViewStyle, TextStyle } from "react-native"
import ErrorBoundary from "../components/errorBoundary"
import { NetworkProvider, useNetwork } from "../contexts/networkContext"
import { AuthProvider, useAuth } from "../contexts/authContext"
import { ThemeProvider } from "../contexts/themeContext"
import LoadingIndicator from "../components/loadingIndicator"
import ErrorMessage from "../components/errorMessage"
import { useGameStore } from "../state/gameStore"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import * as Sentry from "@sentry/react-native"

Sentry.init({
  dsn: "https://c7d927fefd9e0c239fcfef81c1df5def@o4510630361300992.ingest.us.sentry.io/4510630399901696",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  spotlight: __DEV__,
})

// --- LOGBOX SUPPRESSION ---
// We ignore specific warnings to prevent the Yellow Box from blocking
// E2E test interactions (like the bottom tab bar).
LogBox.ignoreLogs([
  "Warning: VictoryPie",
  "Warning: Slice",
  "Warning: VictoryLabel",
  "Linking requires a build-time setting",
  "(ADVICE)",
  "shadow set but cannot calculate",
  "Victory Native components failed to load",
  "Possible stableId collision",
  "VirtualizedList:",
  "ExpoBlurView",
  "Reanimated] Property",
])

function RootLayoutNav() {
  const { isNetworkConnected } = useNetwork()
  const styles = useStyles(themedStyles)
  const [retryKey, setRetryKey] = useState(0)

  const { player, loading: authLoading, error: authError } = useAuth()

  const initializeGame = useGameStore((state) => state.initializeGame)
  const gameLoading = useGameStore((state) => state.loading)
  const gameError = useGameStore((state) => state.error)

  useEffect(() => {
    if (player && isNetworkConnected && !authError) {
      initializeGame(player)
    }
  }, [player, isNetworkConnected, retryKey, authError, initializeGame])

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

  const criticalError = authError || gameError
  if (criticalError) {
    let displayMessage = `Critical Setup Error: ${criticalError}. Please try restarting the app.`

    if (authError?.includes("Missing or insufficient permissions")) {
      displayMessage =
        "Critical Error: Cannot access user data (Firebase permissions failure). This usually indicates an issue with your account setup or backend configuration. Please restart the app or contact support."
    }

    return (
      <View style={styles.container}>
        <ErrorMessage message={displayMessage} onRetry={handleRetry} />
      </View>
    )
  }

  return <Slot key={retryKey} />
}

function RootLayout() {
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

export default Sentry.wrap(RootLayout)

interface RootLayoutStyles {
  container: ViewStyle
  errorText: TextStyle
}

// Colocate the styles directly within the layout file
const themedStyles = (theme: Theme): RootLayoutStyles => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.responsive.scale(10),
  },
  errorText: {
    fontFamily: "Arvo-Regular",
    fontSize: theme.responsive.responsiveFontSize(18),
    color: theme.colors.error,
    textAlign: "center",
    width: "80%",
  },
})
