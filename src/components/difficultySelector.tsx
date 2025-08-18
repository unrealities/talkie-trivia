import React, { useCallback, useMemo } from "react"
import { View, Text, Pressable } from "react-native"
import { Difficulty } from "../models/game"
import { getDifficultySelectorStyles } from "../styles/difficultySelectorStyles"
import { hapticsService } from "../utils/hapticsService"
import { useTheme } from "../contexts/themeContext"
import { useGameSettingsContext } from "../contexts/gameSettingsContext"

const DifficultySelector = () => {
  const { difficulty, setDifficulty } = useGameSettingsContext()
  const { colors } = useTheme()
  const styles = useMemo(() => getDifficultySelectorStyles(colors), [colors])

  const options: { label: string; value: Difficulty; description: string }[] = [
    {
      label: "Very Easy",
      value: "very easy",
      description: "All hints shown at start.",
    },
    { label: "Easy", value: "easy", description: "Use and reveal hints." },
    {
      label: "Medium",
      value: "medium",
      description: "Hints revealed on good guesses.",
    },
    { label: "Hard", value: "hard", description: "No hints." },
    {
      label: "Very Hard",
      value: "very hard",
      description: "3 guesses, delayed clues, no hints.",
    },
  ]

  const handleSelect = useCallback(
    (newDifficulty: Difficulty) => {
      hapticsService.medium()
      setDifficulty(newDifficulty)
    },
    [setDifficulty]
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Difficulty</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => handleSelect(option.value)}
            style={[
              styles.option,
              difficulty === option.value && styles.selectedOption,
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
      <Text style={styles.descriptionText}>
        {options.find((o) => o.value === difficulty)?.description}
      </Text>
    </View>
  )
}

export default DifficultySelector
