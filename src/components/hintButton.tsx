import React, { useEffect, useMemo } from "react"
import { Pressable, Text, StyleProp, ViewStyle } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated"
import Ionicons from "@expo/vector-icons/Ionicons"
import { HintType } from "../models/game"
import { useTheme } from "../contexts/themeContext"
import { getHintStyles } from "../styles/hintStyles"
import { responsive } from "../styles/global"

type HintStatus = "available" | "used" | "disabled"

interface HintButtonProps {
  hintType: HintType
  iconName: keyof typeof Ionicons.glyphMap
  label: string
  onPress: (type: HintType) => void
  status: HintStatus
  accessibilityHintCount: number
  isHighlighted: boolean
}

const HintButton: React.FC<HintButtonProps> = ({
  hintType,
  iconName,
  label,
  onPress,
  status,
  accessibilityHintCount,
  isHighlighted,
}) => {
  const { colors } = useTheme()
  const hintStyles = useMemo(() => getHintStyles(colors), [colors])
  const highlightAnimation = useSharedValue(0)

  useEffect(() => {
    if (isHighlighted) {
      highlightAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        true
      )
    } else {
      highlightAnimation.value = withTiming(0)
    }
  }, [isHighlighted, highlightAnimation])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 1 + highlightAnimation.value * 0.05 }],
      borderColor: isHighlighted
        ? colors.primary
        : hintStyles.hintButton.borderColor,
    }
  })

  const buttonStyle: StyleProp<ViewStyle> = [hintStyles.hintButton]
  if (status === "disabled") {
    buttonStyle.push(hintStyles.disabled)
  } else if (status === "used") {
    buttonStyle.push(hintStyles.usedHintButton)
  }
  if (isHighlighted) {
    buttonStyle.push(hintStyles.highlightedHintButton)
  }

  const getAccessibilityLabel = () => {
    switch (status) {
      case "used":
        return `Re-view the ${label.toLowerCase()} hint.`
      case "disabled":
        return `${label} hint unavailable.`
      case "available":
      default:
        return `Get the movie's ${label.toLowerCase()} hint. ${accessibilityHintCount} hints available.`
    }
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={buttonStyle}
        onPress={() => onPress(hintType)}
        disabled={status === "disabled"}
        accessible
        accessibilityRole="button"
        accessibilityState={{ disabled: status === "disabled" }}
        accessibilityLabel={getAccessibilityLabel()}
      >
        <Ionicons
          name={iconName}
          size={responsive.scale(20)}
          color={
            isHighlighted
              ? colors.primary
              : status === "disabled"
              ? colors.textDisabled
              : status === "used"
              ? colors.tertiary
              : colors.textSecondary
          }
        />
        <Text
          style={[
            hintStyles.buttonTextSmall,
            status === "disabled" && { color: colors.textDisabled },
            status === "used" && { color: colors.tertiary },
            isHighlighted && { color: colors.primary },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  )
}

export default HintButton
