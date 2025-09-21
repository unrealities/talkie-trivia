import { StyleSheet } from "react-native"
import { responsive, spacing } from "./global"

export const getThemeSelectorStyles = (colors: any) =>
  StyleSheet.create({
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
    title: {
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(16),
      color: colors.textPrimary,
      marginLeft: spacing.small,
    },
    optionsContainer: {
      flexDirection: "row",
      backgroundColor: colors.background,
      borderRadius: responsive.scale(8),
      padding: spacing.extraSmall,
      borderWidth: 1,
      borderColor: colors.border,
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
