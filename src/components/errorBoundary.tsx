import React, { Component, ErrorInfo, ReactNode } from "react"
import { View, Text, Button, StyleSheet, Platform, Alert } from "react-native"
import * as Updates from "expo-updates"
import { analyticsService } from "../utils/analyticsService"

const safeStyles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Safe dark background
    padding: 20,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF", // Safe white text
    textAlign: "center",
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    color: "#A0A0A0", // Safe gray text
    textAlign: "center",
    marginBottom: 30,
  },
  errorDetails: {
    marginTop: 30,
    fontSize: 12,
    color: "#757575",
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    paddingHorizontal: 10,
  },
})

const ErrorDisplay = ({
  error,
  onReload,
}: {
  error: Error | null
  onReload: () => void
}) => {
  return (
    <View style={safeStyles.errorContainer}>
      <Text style={safeStyles.titleText}>Oops! Something went wrong.</Text>
      <Text style={safeStyles.messageText}>
        An unexpected error occurred. Please try reloading the app.
      </Text>
      <Button
        title="Reload App"
        onPress={onReload}
        color="#FFC107" // Safe primary color
        testID="reload-button"
      />
      {__DEV__ && (
        <Text style={safeStyles.errorDetails}>
          {error?.message}
          {"\n\n"}
          {error?.stack}
        </Text>
      )}
    </View>
  )
}

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(
    error: Error
  ): Pick<State, "hasError" | "error"> {
    console.error("ErrorBoundary caught an error:", error)
    analyticsService.trackErrorBoundary(error.message)
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary details:", error, errorInfo)
    this.setState({ errorInfo })
  }

  private handleReload = async () => {
    try {
      if (Platform.OS === "web") {
        window.location.reload()
        return
      }

      if (__DEV__) {
        console.log("Attempting to reload app via Updates API...")
      }
      await Updates.reloadAsync()
    } catch (e) {
      console.error("Failed to reload the app:", e)
      Alert.alert(
        "Reload Failed",
        "Could not automatically reload the app. Please close and restart it manually."
      )
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay error={this.state.error} onReload={this.handleReload} />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
