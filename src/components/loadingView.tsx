import React from "react"
import { Button, View, Text, ActivityIndicator } from "react-native"
import { appStyles } from "../styles/AppStyles"
import { colors } from "../styles/global"

interface LoadingViewProps {
  error: string | null
  onRetry?: () => void
}

export const LoadingView: React.FC<LoadingViewProps> = ({ error, onRetry }) => {
  return (
    <View style={appStyles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      {error && (
        <>
          <Text style={appStyles.errorText}>{error}</Text>
          {onRetry && <Button title="Retry" onPress={onRetry} />}
        </>
      )}
    </View>
  )
}
