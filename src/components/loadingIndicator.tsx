import React, { memo } from "react"
import { View, Text, StyleSheet } from "react-native"
import { appStyles } from "../styles/appStyles"
import CustomLoadingIndicator from "./customLoadingIndicator"

interface LoadingIndicatorProps {
  message?: string
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = memo(
  ({ message }) => {
    return (
      <View
        style={appStyles.loadingContainer}
        testID="loading-indicator-container"
      >
        <CustomLoadingIndicator />
        {message && <Text style={appStyles.messageText}>{message}</Text>}
      </View>
    )
  }
)

export default LoadingIndicator
