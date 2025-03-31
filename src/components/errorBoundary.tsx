import React, { Component, ErrorInfo, ReactNode } from "react"
import { View, Text, Button, Alert } from "react-native"
import * as Updates from "expo-updates"
import { appStyles } from "../styles/appStyles"
import { colors } from "../styles/global"

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
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary details:", error, errorInfo)
  }

  private handleReload = async () => {
    try {
      console.log("Attempting to reload app via Updates API...")
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
        <View style={[appStyles.errorContainer, { justifyContent: "center" }]}>
          <Text
            style={[
              appStyles.errorText,
              { marginBottom: 20, fontSize: 20, fontFamily: "Arvo-Bold" },
            ]}
          >
            Oops! Something went wrong.
          </Text>
          <Text
            style={[
              appStyles.errorText,
              { marginBottom: 30, color: colors.lightGrey },
            ]}
          >
            An unexpected error occurred. Please try reloading the app.
          </Text>
          {/* Always show the reload button, rely on try/catch */}
          <Button
            title="Reload App"
            onPress={this.handleReload}
            color={colors.primary}
          />
          <Text
            style={[
              appStyles.errorText,
              { marginTop: 30, fontSize: 12, color: colors.grey },
            ]}
          >
            {__DEV__ && this.state.error?.message}
          </Text>
        </View>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
