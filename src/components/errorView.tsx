import React from "react"
import { View, Text, Button } from "react-native"
import { appStyles } from "../styles/AppStyles"

interface ErrorViewProps {
  message: string
  onRetry: () => void
}

export const ErrorView: React.FC<ErrorViewProps> = ({ message, onRetry }) => {
  return (
    <View style={appStyles.errorContainer}>
      <Text style={appStyles.errorText}>{message}</Text>
      <Button title="Retry" onPress={onRetry} />
    </View>
  )
}
