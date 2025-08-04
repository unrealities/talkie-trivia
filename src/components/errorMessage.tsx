import React, { memo, useMemo } from "react"
import { Text, View, Button } from "react-native"
import { getAppStyles } from "../styles/appStyles"
import { useTheme } from "../contexts/themeContext"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

const ErrorMessage: React.FC<ErrorMessageProps> = memo(
  ({ message, onRetry }) => {
    const { colors } = useTheme()
    const styles = useMemo(() => getAppStyles(colors), [colors])

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{message}</Text>
        {onRetry && <Button testID="retry" title="Retry" onPress={onRetry} />}
      </View>
    )
  },
  (prevProps, nextProps) => prevProps.message === nextProps.message
)

export default ErrorMessage
