import React, { useEffect, useMemo } from "react"
import { Text, View } from "react-native"
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated"
import { useTheme } from "../contexts/themeContext"
import { getFlashMessageStyles } from "../styles/flashMessageStyles"

interface FlashMessageProps {
  message: string | null
  duration?: number
}

const FlashMessages: React.FC<FlashMessageProps> = ({
  message,
  duration = 3000,
}) => {
  const colors = useTheme()
  const styles = useMemo(() => getFlashMessageStyles(colors), [colors])
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (message) {
      opacity.value = withTiming(1, { duration: 300, easing: Easing.ease })
      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300, easing: Easing.ease })
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [message, duration, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  if (!message) return null
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.messageText}>{message}</Text>
    </Animated.View>
  )
}

export default FlashMessages
