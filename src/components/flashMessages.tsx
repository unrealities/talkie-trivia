import React, { useEffect } from "react"
import { Text, View, StyleSheet } from "react-native"
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated"
import { colors, responsive } from "../styles/global" // Assuming colors and responsive are in global.ts

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
    top: responsive.scale(50), // Adjust positioning as needed
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure it's on top
    alignItems: "center",
    justifyContent: "center",
  },
  messageBox: {
    backgroundColor: colors.quinary, // Example background color
    borderRadius: responsive.scale(8),
    paddingVertical: responsive.scale(10),
    paddingHorizontal: responsive.scale(20),
    marginHorizontal: responsive.scale(20),
  },
  messageText: {
    color: colors.background, // Example text color
    fontSize: responsive.responsiveFontSize(16),
    fontFamily: "Arvo-Bold", // Assuming you have this font
    textAlign: "center",
  },
})

export default flashMessages
