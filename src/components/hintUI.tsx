// src/components/hintUI.tsx

import React, { memo, useEffect } from "react"
import { View, Pressable, ViewStyle, TextStyle } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import { HintType } from "../models/game"
import HintButton from "./hintButton"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { Typography } from "./ui/typography"
import { Hint } from "../models/trivia"

type HintStatus = "available" | "used" | "disabled"

// A map to associate hint types with specific icons.
// Add new game mode hint types here (e.g., 'developer', 'platform').
const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  decade: "calendar-outline",
  director: "film-outline",
  actor: "person-outline",
  genre: "folder-open-outline",
  developer: "game-controller-outline",
  platform: "hardware-chip-outline",
  default: "information-circle-outline",
}

interface HintUIProps {
  showHintOptions: boolean
  displayedHintText: string | null
  hintLabelText: string
  isToggleDisabled: boolean
  hintsAvailable: number
  hintStatuses: Record<string, HintStatus>
  highlightedHint: string | null
  handleToggleHintOptions: () => void
  handleHintSelection: (type: HintType) => void
  allHints: Hint[]
}

const HINT_CONTAINER_HEIGHT = 80 // Adjusted for better spacing

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
    allHints,
  }) => {
    const styles = useStyles(themedStyles)
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
      <View style={styles.container}>
        <Pressable
          onPress={handleToggleHintOptions}
          disabled={isToggleDisabled}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ disabled: isToggleDisabled }}
          accessibilityLabel={hintLabelText}
          style={isToggleDisabled ? styles.disabled : {}}
        >
          <Typography
            variant="body"
            style={[
              styles.hintLabel,
              isToggleDisabled && styles.hintLabelDisabled,
            ]}
          >
            {hintLabelText}
          </Typography>
        </Pressable>

        <Animated.View
          style={[styles.hintButtonsContainer, animatedContainerStyle]}
        >
          <View style={styles.hintButtonArea}>
            {allHints.map((hint) => (
              <HintButton
                key={hint.type}
                hintType={hint.type}
                iconName={ICON_MAP[hint.type] || ICON_MAP.default}
                label={hint.label}
                onPress={handleHintSelection}
                status={hintStatuses[hint.type]}
                accessibilityHintCount={hintsAvailable}
                isHighlighted={highlightedHint === hint.type}
              />
            ))}
          </View>
        </Animated.View>

        {displayedHintText && (
          <View style={styles.displayedHintContainer}>
            <View style={styles.displayedHintContent}>
              <Ionicons name="bulb-outline" style={styles.displayedHintIcon} />
              <Typography style={styles.hintText}>
                {displayedHintText}
              </Typography>
            </View>
          </View>
        )}
      </View>
    )
  }
)

interface HintUIStyles {
  container: ViewStyle
  disabled: ViewStyle
  hintLabel: TextStyle
  hintLabelDisabled: TextStyle
  hintButtonsContainer: ViewStyle
  hintButtonArea: ViewStyle
  displayedHintContainer: ViewStyle
  displayedHintContent: ViewStyle
  displayedHintIcon: TextStyle
  hintText: TextStyle
}

const themedStyles = (theme: Theme): HintUIStyles => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: theme.responsive.scale(2),
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  hintLabel: {
    ...theme.typography.bodyText,
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(14),
    marginVertical: theme.responsive.scale(4),
    textAlign: "center",
    paddingVertical: theme.responsive.scale(4),
  },
  hintLabelDisabled: {
    color: theme.colors.textDisabled,
  },
  hintButtonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
  },
  hintButtonArea: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "nowrap",
    width: "100%",
  },
  displayedHintContainer: {
    marginTop: theme.spacing.small,
    padding: theme.responsive.scale(2),
    backgroundColor: theme.colors.tertiary,
    borderRadius: theme.responsive.scale(10),
    width: "90%",
    alignSelf: "center",
  },
  displayedHintContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.responsive.scale(8),
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
  },
  displayedHintIcon: {
    color: theme.colors.tertiary,
    fontSize: theme.responsive.responsiveFontSize(18),
    marginRight: theme.spacing.small,
  },
  hintText: {
    color: theme.colors.primary,
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(16),
    textAlign: "center",
  },
})

export default HintUI
