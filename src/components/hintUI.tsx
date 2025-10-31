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
