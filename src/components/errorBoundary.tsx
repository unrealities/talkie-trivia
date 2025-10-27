import React, { Component, ErrorInfo, ReactNode, useMemo } from "react"
import { View, Text, Button, Alert } from "react-native"
import * as Updates from "expo-updates"
import { analyticsService } from "../utils/analyticsService"
import { useTheme } from "../contexts/themeContext"
import { getErrorBoundaryStyles } from "../styles/errorBoundaryStyles"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

const ErrorDisplay = ({ error, onReload }) => {
  const { colors } = useTheme()
  const styles = useMemo(() => getErrorBoundaryStyles(colors), [colors])

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.titleText}>Oops! Something went wrong.</Text>
      <Text style={styles.messageText}>
        An unexpected error occurred. Please try reloading the app.
      </Text>
      <Button
        title="Reload App"
        onPress={onReload}
        color={colors.primary}
        testID="reload-button"
      />
      {__DEV__ && <Text style={styles.errorDetails}>{error?.message}</Text>}
    </View>
  )
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
        <ErrorDisplay error={this.state.error} onReload={this.handleReload} />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
