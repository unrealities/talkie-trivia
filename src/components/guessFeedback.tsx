import React, { memo, useEffect } from "react"
import { Text } from "react-native"
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { guessFeedbackStyles as styles } from "../styles/guessFeedbackStyles"
import { colors } from "../styles/global"

interface GuessFeedbackProps {
  message: string | null
  isCorrect: boolean | null
}

const GuessFeedback: React.FC<GuessFeedbackProps> = memo(
  ({ message, isCorrect }) => {
    const animation = useSharedValue(0)

    useEffect(() => {
      if (message) {
        animation.value = withSequence(
          withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
          withDelay(
            1500,
            withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) })
          )
        )
      } else {
        animation.value = 0
      }
    }, [message, animation])

    const animatedContainerStyle = useAnimatedStyle(() => {
      const translateY = interpolate(animation.value, [0, 1], [20, 0])
      return {
        opacity: animation.value,
        transform: [{ translateY }],
      }
    })

    if (!message) {
      return null
    }

    const containerStyle = [
      styles.container,
      isCorrect ? styles.correct : styles.incorrect,
    ]
    const textStyle = [
      styles.text,
      isCorrect ? { color: colors.background } : { color: colors.secondary },
    ]

    return (
      <Animated.View style={[containerStyle, animatedContainerStyle]}>
        <Text style={textStyle}>{message}</Text>
      </Animated.View>
    )
  }
)

export default GuessFeedback
