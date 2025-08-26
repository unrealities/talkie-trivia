import React, { memo, useEffect, useMemo } from "react"
import { View, Pressable, Text, StyleProp, ViewStyle } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated"
import { getHintStyles } from "../styles/hintStyles"
import { responsive } from "../styles/global"
import { useTheme } from "../contexts/themeContext"
import { HintType } from "../models/game"

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

interface HintUIProps {
  showHintOptions: boolean
  displayedHintText: string | null
  hintLabelText: string
  isToggleDisabled: boolean
  hintsAvailable: number
  hintStatuses: Record<HintType, HintStatus>
  highlightedHint: HintType | null
  handleToggleHintOptions: () => void
  handleHintSelection: (type: HintType) => void
}

const HINT_CONTAINER_HEIGHT = responsive.scale(60)

const HintUI: React.FC<HintUIProps> = memo(
  ({
    showHintOptions,
    displayedHintText,
    hintLabelText,
    isToggleDisabled,
    hintsAvailable,
    hintStatuses,
    highlightedHint,
    handleToggleHintOptions,
    handleHintSelection,
  }) => {
    const { colors } = useTheme()
    const hintStyles = useMemo(() => getHintStyles(colors), [colors])
    const animatedHeight = useSharedValue(0)

    const animatedContainerStyle = useAnimatedStyle(() => {
      return {
        height: animatedHeight.value,
        opacity: withTiming(animatedHeight.value > 0 ? 1 : 0, {
          duration: 150,
        }),
      }
    })

    useEffect(() => {
      animatedHeight.value = withTiming(
        showHintOptions ? HINT_CONTAINER_HEIGHT : 0,
        {
          duration: 300,
        }
      )
    }, [showHintOptions, animatedHeight])

    return (
      <View style={hintStyles.container}>
        <Pressable
          onPress={handleToggleHintOptions}
          disabled={isToggleDisabled}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ disabled: isToggleDisabled }}
          accessibilityLabel={hintLabelText}
          style={isToggleDisabled ? hintStyles.disabled : {}}
        >
          <Text
            style={[
              hintStyles.hintLabel,
              isToggleDisabled && { color: colors.textDisabled },
            ]}
          >
            {hintLabelText}
          </Text>
        </Pressable>

        <Animated.View
          style={[hintStyles.hintButtonsContainer, animatedContainerStyle]}
        >
          <View style={hintStyles.hintButtonArea}>
            <HintButton
              hintType="decade"
              iconName="calendar-outline"
              label="Decade"
              onPress={handleHintSelection}
              status={hintStatuses.decade}
              accessibilityHintCount={hintsAvailable}
              isHighlighted={highlightedHint === "decade"}
            />
            <HintButton
              hintType="director"
              iconName="film-outline"
              label="Director"
              onPress={handleHintSelection}
              status={hintStatuses.director}
              accessibilityHintCount={hintsAvailable}
              isHighlighted={highlightedHint === "director"}
            />
            <HintButton
              hintType="actor"
              iconName="person-outline"
              label="Actor"
              onPress={handleHintSelection}
              status={hintStatuses.actor}
              accessibilityHintCount={hintsAvailable}
              isHighlighted={highlightedHint === "actor"}
            />
            <HintButton
              hintType="genre"
              iconName="folder-open-outline"
              label="Genre"
              onPress={handleHintSelection}
              status={hintStatuses.genre}
              accessibilityHintCount={hintsAvailable}
              isHighlighted={highlightedHint === "genre"}
            />
          </View>
        </Animated.View>

        {displayedHintText && (
          <View style={hintStyles.displayedHintContainer}>
            <View style={hintStyles.displayedHintContent}>
              <Ionicons
                name="bulb-outline"
                style={hintStyles.displayedHintIcon}
              />
              <Text style={hintStyles.hintText}>{displayedHintText}</Text>
            </View>
          </View>
        )}
      </View>
    )
  }
)

export default HintUI
