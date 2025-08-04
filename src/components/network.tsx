import React, { memo, useMemo } from "react"
import { Text, View } from "react-native"
import { getNetworkStyles } from "../styles/networkStyles"
import { useTheme } from "../contexts/themeContext"

interface NetworkContainerProps {
  isConnected: boolean
}

const NetworkContainer = memo(
  ({ isConnected }: NetworkContainerProps) => {
    const { colors } = useTheme()
    const networkStyles = useMemo(() => getNetworkStyles(colors), [colors])

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
          Network is {isConnected ? "connected" : "not connected"}
        </Text>
      </View>
    )
  },
  (prevProps, nextProps) => prevProps.isConnected === nextProps.isConnected
)

export default NetworkContainer
