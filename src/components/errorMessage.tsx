import React, { memo } from "react"
import { Text, View, Button } from "react-native"
import { appStyles } from "../styles/appStyles"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

const ErrorMessage: React.FC<ErrorMessageProps> = memo(
  ({ message, onRetry }) => {
    return (
      <View style={appStyles.errorContainer}>
        <Text style={appStyles.errorText}>{message}</Text>
        {onRetry && <Button testID="retry" title="Retry" onPress={onRetry} />}
      </View>
    )
  },
  (prevProps, nextProps) => prevProps.message === nextProps.message
)

export default ErrorMessage
