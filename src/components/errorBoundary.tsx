import React, { Component, ErrorInfo, ReactNode } from "react"
import { View, Text, Button, Alert, StyleSheet } from "react-native"
import * as Updates from "expo-updates"
import { analyticsService } from "../utils/analyticsService"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    console.error("ErrorBoundary caught an error:", error)
    analyticsService.trackErrorBoundary(error.message)
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary details:", error, errorInfo)
  }

  private handleReload = async () => {
    try {
      if (__DEV__) {
        console.log("Attempting to reload app via Updates API...")
      }
      await Updates.reloadAsync()
    } catch (e) {
      console.error("Failed to reload the app via Updates API:", e)
      Alert.alert(
        "Reload Failed",
        "Could not automatically reload the app. Please close and restart it manually."
      )
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.titleText}>Oops! Something went wrong.</Text>
          <Text style={styles.messageText}>
            An unexpected error occurred. Please try reloading the app.
          </Text>
          <Button
            title="Reload App"
            onPress={this.handleReload}
            color="#FFC107" // Hardcoded primary color
            testID="reload-button"
          />
          {__DEV__ && (
            <Text style={styles.errorDetails}>{this.state.error?.message}</Text>
          )}
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Hardcoded dark background
    padding: 20,
  },
  titleText: {
    fontSize: 20,
    fontFamily: "Arvo-Bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    color: "#A0A0A0",
    textAlign: "center",
    marginBottom: 30,
  },
  errorDetails: {
    marginTop: 30,
    fontSize: 12,
    color: "#A0A0A0",
  },
})

export default ErrorBoundary
