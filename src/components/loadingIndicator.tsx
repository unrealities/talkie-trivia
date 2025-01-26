import React, { memo } from "react"
import { View } from "react-native"
import { appStyles } from "../styles/appStyles"
import CustomLoadingIndicator from "./customLoadingIndicator"

const LoadingIndicator: React.FC = memo(() => {
  return (
    <View style={appStyles.loadingContainer}>
      <CustomLoadingIndicator />
    </View>
  )
})

export default LoadingIndicator
