import React, { useEffect } from "react"
import { Text, View, StyleSheet } from "react-native"
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated"
import { colors, responsive } from "../styles/global"

interface flashMessageProps {
  message: string | null
  duration?: number
}

const flashMessages: React.FC<flashMessageProps> = ({
  message,
  duration = 3000,
}) => {
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

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: responsive.scale(4),
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
  },
  messageBox: {
    backgroundColor: colors.quinary,
    borderRadius: responsive.scale(8),
    paddingVertical: responsive.scale(10),
    paddingHorizontal: responsive.scale(20),
    marginHorizontal: responsive.scale(20),
  },
  messageText: {
    color: colors.background,
    fontSize: responsive.responsiveFontSize(16),
    fontFamily: "Arvo-Bold",
    textAlign: "center",
  },
})

export default flashMessages
