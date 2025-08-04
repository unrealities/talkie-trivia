import React, { memo, useMemo } from "react"
import { View, Text } from "react-native"
import { getAppStyles } from "../styles/appStyles"
import CustomLoadingIndicator from "./customLoadingIndicator"
import { useTheme } from "../contexts/themeContext"

interface LoadingIndicatorProps {
  message?: string
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = memo(
  ({ message }) => {
    const { colors } = useTheme()
    const styles = useMemo(() => getAppStyles(colors), [colors])

    return (
      <View
        style={styles.loadingContainer}
        testID="loading-indicator-container"
      >
        <CustomLoadingIndicator />
        {message && <Text style={styles.messageText}>{message}</Text>}
      </View>
    )
  }
)

export default LoadingIndicator
