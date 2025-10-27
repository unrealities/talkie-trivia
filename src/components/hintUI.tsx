import React, { memo, useEffect, useMemo } from "react"
import { View, Pressable, Text } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import { getHintStyles } from "../styles/hintStyles"
import { responsive } from "../styles/global"
import { useTheme } from "../contexts/themeContext"
import { HintType } from "../models/game"
import HintButton from "./hintButton"

type HintStatus = "available" | "used" | "disabled"

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
