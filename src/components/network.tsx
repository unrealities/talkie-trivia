import React, { useEffect, useState } from "react"
import { Text, View } from "react-native"

import { networkStyles } from "../styles/networkStyles"

interface NetworkContainerProps {
  isConnected: boolean
}

const NetworkContainer = ({ isConnected }: NetworkContainerProps) => {
  const [text, setText] = useState<string>("not connected")

  useEffect(() => {
    setText(isConnected ? "connected" : "not connected")
  }, [isConnected])

  return (
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
        Network is {text}
      </Text>
    </View>
  )
}

export default NetworkContainer
