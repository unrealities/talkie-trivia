import React from "react"
import { View, ActivityIndicator } from "react-native"
import { appStyles } from "../styles/appStyles"
import { colors } from "../styles/global"

const LoadingIndicator: React.FC = () => {
  return (
    <View style={appStyles.loadingContainer}>
      <ActivityIndicator testID="activity-indicator" size="large" color={colors.primary} />
    </View>
  )
}

export default LoadingIndicator
