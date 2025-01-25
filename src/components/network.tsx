import React, { memo } from "react"
import { Text, View } from "react-native"
import { networkStyles } from "../styles/networkStyles"

interface NetworkContainerProps {
  isConnected: boolean
}

const NetworkContainer = memo(
  ({ isConnected }: NetworkContainerProps) => (
    <View
      style={
        isConnected
          ? networkStyles.containerConnected
          : networkStyles.containerNotConnected
      }
    >
      <Text
        style={
          isConnected ? networkStyles.connected : networkStyles.notConnected
        }
      >
        Network is {isConnected ? "connected" : "not connected"}
      </Text>
    </View>
  ),
  (prevProps, nextProps) => prevProps.isConnected === nextProps.isConnected
)

export default NetworkContainer
