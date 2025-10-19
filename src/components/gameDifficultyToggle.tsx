import React, { useCallback, useMemo, useState, useEffect } from "react"
import { View, Text, Pressable } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"
import { FontAwesome } from "@expo/vector-icons"
import { getGameDifficultyToggleStyles } from "../styles/gameDifficultyToggleStyles"
import { hapticsService } from "../utils/hapticsService"
import { useTheme } from "../contexts/themeContext"
import { useGameStore } from "../state/gameStore"
import { DifficultyLevel, DIFFICULTY_MODES } from "../config/difficulty"

const options = (Object.keys(DIFFICULTY_MODES) as DifficultyLevel[]).map(
  (key) => ({
    value: key,
    label: DIFFICULTY_MODES[key].label,
  })
)

const DROPDOWN_HEIGHT = options.length * 60 // Increased height per item

const GameDifficultyToggle = () => {
  const { colors } = useTheme()
  const styles = useMemo(() => getGameDifficultyToggleStyles(colors), [colors])

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
  }, [isExpanded])

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

export default GameDifficultyToggle
