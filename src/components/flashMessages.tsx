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

interface flashMessageProps {
  message: string | null
  duration?: number
}

const FlashMessages: React.FC<flashMessageProps> = ({
  message,
  duration = 3000,
}) => {
  const { colors } = useTheme()
  const styles = useMemo(() => getFlashMessageStyles(colors), [colors])
  const opacity = useSharedValue(0)

  const showMessage = () => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.ease })
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
      cleanup = showMessage()
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
    return null
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </Animated.View>
  )
}

export default FlashMessages
