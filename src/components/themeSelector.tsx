import React, { useMemo } from "react"
import { View, Text, Pressable } from "react-native"
import { useTheme, Theme } from "../contexts/themeContext"
import { getThemeSelectorStyles } from "../styles/themeSelectorStyles"
import { FontAwesome } from "@expo/vector-icons"
import { responsive } from "../styles/global"

const ThemeSelector = () => {
  const { theme, setTheme, colors } = useTheme()
  const styles = useMemo(() => getThemeSelectorStyles(colors), [colors])

  const options: { label: string; value: Theme }[] = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <FontAwesome
          name="paint-brush"
          size={responsive.responsiveFontSize(16)}
          color={colors.textSecondary}
        />
        <Text style={styles.title}>Theme</Text>
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => setTheme(option.value)}
            style={[
              styles.option,
              theme === option.value && styles.selectedOption,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: theme === option.value }}
            accessibilityLabel={`Set theme to ${option.label}`}
          >
            <Text
              style={[
                styles.optionText,
                theme === option.value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

export default ThemeSelector
