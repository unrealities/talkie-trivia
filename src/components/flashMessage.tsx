import React, { useEffect } from "react"
import { Text, View, StyleSheet } from "react-native"
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated"
import { flashMessageStyles } from "../styles/flashMessageStyles"

interface FlashMessageProps {
  message: string | null
  duration?: number
}

const FlashMessage: React.FC<FlashMessageProps> = ({
  message,
  duration = 3000,
}) => {
  const opacity = useSharedValue(0)

  const showMessage = () => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.ease })
    // Hide message after duration
    if (message) {
      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300, easing: Easing.ease })
      }, duration)
      return () => clearTimeout(timer)
    }
  }

  useEffect(() => {
    let cleanup: (() => void) | undefined
    if (message) {
      cleanup = runOnJS(showMessage)()
    } else {
      opacity.value = withTiming(0, { duration: 300, easing: Easing.ease })
    }
    return cleanup
  }, [message, duration])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  if (!message) {
    return null // Don't render anything if no message
  }

  return (
    <Animated.View style={[flashMessageStyles.container, animatedStyle]}>
      <View style={flashMessageStyles.messageBox}>
        <Text style={flashMessageStyles.messageText}>{message}</Text>
      </View>
    </Animated.View>
  )
}

export default FlashMessage
