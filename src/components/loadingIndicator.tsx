import React from "react"
import { View, ActivityIndicator } from "react-native"
import { appStyles } from "../styles/AppStyles"
import { colors } from "../styles/global"

const LoadingIndicator: React.FC = () => {
  return (
    <View style={appStyles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}

export default LoadingIndicator
