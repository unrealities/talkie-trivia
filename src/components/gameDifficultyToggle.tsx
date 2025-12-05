import React, { useCallback, useState, useEffect } from "react"
import { View, Text, Pressable, ViewStyle, TextStyle } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"
import { FontAwesome } from "@expo/vector-icons"
import { hapticsService } from "../utils/hapticsService"
import { useGameStore } from "../state/gameStore"
import { DifficultyLevel, DIFFICULTY_MODES } from "../config/difficulty"
import { useStyles, Theme, useThemeTokens } from "../utils/hooks/useStyles"

const options = (Object.keys(DIFFICULTY_MODES) as DifficultyLevel[]).map(
  (key) => ({
    value: key,
    label: DIFFICULTY_MODES[key].label,
  })
)

const DROPDOWN_HEIGHT = options.length * 44

const GameDifficultyToggle = () => {
  const styles = useStyles(themedStyles)
  const theme = useThemeTokens()
  const { colors } = theme

  const difficulty = useGameStore((state) => state.difficulty)
  const setDifficulty = useGameStore((state) => state.setDifficulty)
  const guesses = useGameStore((state) => state.playerGame.guesses)
  const isInteractionsDisabled = useGameStore(
    (state) => state.isInteractionsDisabled
  )

  const [isExpanded, setIsExpanded] = useState(false)
  const animation = useSharedValue(0)

  useEffect(() => {
    animation.value = withTiming(isExpanded ? 1 : 0, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    })
  }, [isExpanded, animation])

  const animatedDropdownStyle = useAnimatedStyle(() => {
    return {
      height: animation.value * DROPDOWN_HEIGHT,
      opacity: animation.value,
    }
  })

  const handleToggle = () => {
    if (isInteractionsDisabled) return
    hapticsService.light()
    setIsExpanded(!isExpanded)
  }

  const handleSelect = useCallback(
    (newDifficulty: DifficultyLevel) => {
      hapticsService.medium()
      setDifficulty(newDifficulty)
      setIsExpanded(false)
    },
    [setDifficulty]
  )

  const currentLabel =
    options.find((o) => o.value === difficulty)?.label || "Select"

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleToggle}
        style={styles.toggleButton}
        disabled={isInteractionsDisabled}
        accessibilityRole="button"
        accessibilityLabel={currentLabel}
        accessibilityState={{
          disabled: isInteractionsDisabled,
          expanded: isExpanded,
        }}
      >
        <Text style={styles.toggleButtonText}>{currentLabel}</Text>
        <FontAwesome
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.textSecondary}
        />
      </Pressable>

      <Animated.View style={[styles.dropdownContainer, animatedDropdownStyle]}>
        {options.map((option) => {
          const isDisabled =
            DIFFICULTY_MODES[option.value].guessesMax < guesses.length
          return (
            <Pressable
              key={option.value}
              onPress={() => handleSelect(option.value)}
              style={[styles.optionButton, isDisabled && styles.disabledOption]}
              disabled={isDisabled}
              accessibilityRole="button"
              accessibilityState={{ disabled: isDisabled }}
            >
              <Text
                style={[
                  styles.optionText,
                  difficulty === option.value && styles.selectedOptionText,
                  isDisabled && styles.disabledText,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          )
        })}
      </Animated.View>
    </View>
  )
}

interface GameDifficultyToggleStyles {
  container: ViewStyle
  toggleButton: ViewStyle
  toggleButtonText: TextStyle
  dropdownContainer: ViewStyle
  optionButton: ViewStyle
  optionText: TextStyle
  selectedOptionText: TextStyle
  disabledOption: ViewStyle
  disabledText: TextStyle
}

const themedStyles = (theme: Theme): GameDifficultyToggleStyles => ({
  container: {
    alignItems: "center",
    marginVertical: theme.spacing.small,
    zIndex: 10,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.extraSmall,
    paddingHorizontal: theme.spacing.small,
    borderRadius: theme.responsive.scale(8),
    ...theme.shadows.light,
  },
  toggleButtonText: {
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(14),
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.small,
  },
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    width: theme.responsive.scale(120),
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.responsive.scale(8),
    marginTop: theme.spacing.extraSmall,
    ...theme.shadows.medium,
    overflow: "hidden",
  },
  optionButton: {
    padding: theme.spacing.small,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  optionText: {
    fontFamily: "Arvo-Regular",
    fontSize: theme.responsive.responsiveFontSize(16),
    color: theme.colors.textPrimary,
  },
  selectedOptionText: {
    fontFamily: "Arvo-Bold",
    color: theme.colors.primary,
  },
  disabledOption: {
    backgroundColor: theme.colors.backgroundLight,
  },
  disabledText: {
    color: theme.colors.textDisabled,
  },
})

export default GameDifficultyToggle
