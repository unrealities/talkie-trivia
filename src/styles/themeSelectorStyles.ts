import { StyleSheet } from "react-native"
import { responsive, spacing } from "./global"

export const getThemeSelectorStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.large,
      alignItems: "center",
    },
    title: {
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(20),
      color: colors.primary,
      marginBottom: spacing.medium,
    },
    optionsContainer: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: responsive.scale(8),
      padding: spacing.extraSmall,
    },
    option: {
      paddingVertical: spacing.small,
      paddingHorizontal: spacing.medium,
      borderRadius: responsive.scale(6),
    },
    selectedOption: {
      backgroundColor: colors.primary,
    },
    optionText: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(14),
      color: colors.textPrimary,
    },
    selectedOptionText: {
      fontFamily: "Arvo-Bold",
      color: colors.background,
    },
  })
