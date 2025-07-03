import { useEffect } from "react"
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated"

export const useSkeletonAnimation = (
  initialValue = 1,
  finalValue = 0.6,
  duration = 800
) => {
  const opacity = useSharedValue(initialValue)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(finalValue, {
        duration: duration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    )
  }, [opacity, initialValue, finalValue, duration])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  return animatedStyle
}
