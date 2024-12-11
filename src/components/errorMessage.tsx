import React from "react"
import { Text, View, Button } from "react-native"
import { appStyles } from "../styles/AppStyles"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <View style={appStyles.errorContainer}>
      <Text style={appStyles.errorText}>{message}</Text>
      {onRetry && <Button title="Retry" onPress={onRetry} />}
    </View>
  )
}

export default ErrorMessage
