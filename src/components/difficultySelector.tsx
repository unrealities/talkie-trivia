import React, { useCallback, useMemo, useState, useEffect } from "react"
import { View, Text, Pressable } from "react-native"
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from "react-native-reanimated"
import { Difficulty } from "../models/game"
import { getDifficultySelectorStyles } from "../styles/difficultySelectorStyles"
import { hapticsService } from "../utils/hapticsService"
import { useTheme } from "../contexts/themeContext"
import { useGameStore } from "../state/gameStore"
import { useAuth } from "../contexts/authContext"
import { FontAwesome } from "@expo/vector-icons"
import { responsive } from "../styles/global"

const DifficultySelector = () => {
  const { player } = useAuth()
  const difficulty = useGameStore((state) => state.difficulty)
  const setDifficulty = useGameStore((state) => state.setDifficulty)

  const { colors } = useTheme()
  const styles = useMemo(() => getDifficultySelectorStyles(colors), [colors])

  const [hoveredDifficulty, setHoveredDifficulty] = useState<Difficulty | null>(
    null
  )

  const options: { label: string; value: Difficulty; description: string }[] = [
    {
      label: "Very Easy",
      value: "very easy",
      description:
        "All movie facts and hints are revealed at the start of the game.",
    },
    {
      label: "Easy",
      value: "easy",
      description:
        "Reveal clues gradually. You can use earned hint points to reveal specific hints like Decade, Director, Actor, or Genre.",
    },
    {
      label: "Medium",
      value: "medium",
      description:
        "Hints are automatically revealed when you make a guess that shares a category (like actor or decade) with the correct movie.",
    },
    {
      label: "Hard",
      value: "hard",
      description:
        "A pure test of knowledge. No hints are available or revealed throughout the game.",
    },
    {
      label: "Very Hard",
      value: "very hard",
      description:
        "The ultimate challenge. You only get 3 guesses, clues are revealed more slowly, and no hints are available.",
    },
  ]

  const handleSelect = useCallback(
    (newDifficulty: Difficulty) => {
      if (player) {
        hapticsService.medium()
        setDifficulty(newDifficulty, player)
      }
    },
    [setDifficulty, player]
  )

  const descriptionToDisplay = useMemo(() => {
    const key = hoveredDifficulty || difficulty
    return options.find((o) => o.value === key)?.description || ""
  }, [hoveredDifficulty, difficulty])

  const [currentDescription, setCurrentDescription] =
    useState(descriptionToDisplay)
  const descriptionOpacity = useSharedValue(1)

  useEffect(() => {
    descriptionOpacity.value = withTiming(
      0,
      { duration: 150, easing: Easing.ease },
      (finished) => {
        if (finished) {
          runOnJS(setCurrentDescription)(descriptionToDisplay)
        }
      }
    )
  }, [descriptionToDisplay])

  useEffect(() => {
    descriptionOpacity.value = withTiming(1, {
      duration: 150,
      easing: Easing.ease,
    })
  }, [currentDescription])

  const animatedDescriptionStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
  }))

  const handleLongPress = (value: Difficulty) => {
    hapticsService.light()
    setHoveredDifficulty(value)
  }

  const selectedOptionLabel =
    options.find((o) => o.value === difficulty)?.label || "Medium"

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <FontAwesome
            name="gamepad"
            size={responsive.responsiveFontSize(16)}
            color={colors.textSecondary}
          />
          <Text style={styles.title}>Difficulty</Text>
        </View>
        <View style={styles.selectedOptionDisplay}>
          <Text style={styles.selectedOptionTextDisplay}>
            {selectedOptionLabel}
          </Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Long-press any option below to see its description.
      </Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => handleSelect(option.value)}
            onLongPress={() => handleLongPress(option.value)}
            onPressOut={() => setHoveredDifficulty(null)}
            delayLongPress={200}
            style={({ pressed }) => [
              styles.option,
              difficulty === option.value && styles.selectedOption,
              pressed && { opacity: 0.7 },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: difficulty === option.value }}
            accessibilityLabel={`Set difficulty to ${option.label}. ${option.description}`}
          >
            <Text
              style={[
                styles.optionText,
                difficulty === option.value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Animated.View
        style={[styles.descriptionContainer, animatedDescriptionStyle]}
      >
        <Text style={styles.descriptionText}>{currentDescription}</Text>
      </Animated.View>
    </View>
  )
}

export default DifficultySelector
