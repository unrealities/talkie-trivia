import React, { useEffect, useMemo } from "react"
import { View, Text, Pressable } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated"
import { useTheme } from "../contexts/themeContext"
import { getTutorialTooltipStyles } from "../styles/tutorialTooltipStyles"
import { hapticsService } from "../utils/hapticsService"

interface TutorialTooltipProps {
  isVisible: boolean
  text: string
  onDismiss: () => void
  style?: object
}

const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
  isVisible,
  text,
  onDismiss,
  style,
}) => {
  const { colors } = useTheme()
  const styles = useMemo(() => getTutorialTooltipStyles(colors), [colors])
  const animation = useSharedValue(0)

  useEffect(() => {
    animation.value = withTiming(isVisible ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    })
  }, [isVisible, animation])

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value,
      transform: [
        {
          translateY: interpolate(animation.value, [0, 1], [10, 0]),
        },
      ],
    }
  })

  const handleDismiss = () => {
    hapticsService.medium()
    onDismiss()
  }

  if (!isVisible) {
    return null
  }

  return (
    <Animated.View style={[styles.container, animatedContainerStyle, style]}>
      <View style={styles.tooltipBox}>
        <Text style={styles.text}>{text}</Text>
        <Pressable
          onPress={handleDismiss}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.buttonText}>Got it</Text>
        </Pressable>
      </View>
      <View style={styles.pointer} />
    </Animated.View>
  )
}

export default TutorialTooltip
