import React from "react"
import { View, Pressable, ViewStyle, TextStyle } from "react-native"
import { useTheme, Theme as ThemeType } from "../contexts/themeContext"
import { FontAwesome } from "@expo/vector-icons"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { Typography } from "./ui/typography"

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme()
  const styles = useStyles(themedStyles)

  const options: { label: string; value: ThemeType }[] = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <FontAwesome
          name="paint-brush"
          size={styles.icon.fontSize}
          color={styles.icon.color}
        />
        <Typography style={styles.title}>Theme</Typography>
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
            <Typography
              style={[
                styles.optionText,
                theme === option.value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Typography>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

interface ThemeSelectorStyles {
  container: ViewStyle
  labelContainer: ViewStyle
  icon: TextStyle
  title: TextStyle
  optionsContainer: ViewStyle
  option: ViewStyle
  selectedOption: ViewStyle
  optionText: TextStyle
  selectedOptionText: TextStyle
}

const themedStyles = (theme: Theme): ThemeSelectorStyles => ({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: theme.responsive.responsiveFontSize(16),
    color: theme.colors.textSecondary,
  },
  title: {
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(16),
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.small,
  },
  optionsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.background,
    borderRadius: theme.responsive.scale(8),
    padding: theme.spacing.extraSmall,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  option: {
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
    borderRadius: theme.responsive.scale(6),
  },
  selectedOption: {
    backgroundColor: theme.colors.primary,
  },
  optionText: {
    fontFamily: "Arvo-Regular",
    fontSize: theme.responsive.responsiveFontSize(14),
    color: theme.colors.textPrimary,
  },
  selectedOptionText: {
    fontFamily: "Arvo-Bold",
    color: theme.colors.background,
  },
})

export default ThemeSelector
